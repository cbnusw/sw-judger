const asyncHandler = require('express-async-handler');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { Otp, RefreshToken, User, UserInfo } = require('../shared/models/@auth');
const { createResponse } = require('../shared/utils/response');
const { updateFiles, removeFileByUrl } = require('../shared/utils/file');
const { sendMail } = require('../shared/services/mail');
const { hasRoles } = require('../shared/utils/permission');
const { NOT_OPERATOR_ROLES } = require('../shared/constants');
const {
  EMAIL_USED,
  FORBIDDEN,
  INVALID_OTP,
  INVALID_PASSWORD,
  INVALID_ROLE,
  PASSWORD_REQUIRED,
  PHONE_NUMBER_USED,
  REG_NUMBER_REQUIRED,
  REG_NUMBER_USED,
  TOKEN_REQUIRED,
  USER_DEPARTMENT_REQUIRED,
  USER_EMAIL_REQUIRED,
  USER_INFO_REQUIRED,
  USER_NAME_REQUIRED,
  USER_PHONE_REQUIRED,
  USER_INFO_NOT_FOUND,
  USER_NOT_FOUND
} = require('../shared/errors');

const getMe = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const doc = await User.findById(user._id)
    .select('-hashedPassword')
    .populate('info');

  res.json(createResponse(res, doc));
});

const logout = asyncHandler(async (req, res, next) => {
  const token = req.headers['x-refresh-token'];
  const id = await verifyRefreshToken(token);

  await RefreshToken.removeToken(id, token);

  res.json(createResponse(res));
});

const validateAccessToken = (req, res) => {
  res.json(createResponse(res, req.user));
};

const refreshToken = asyncHandler(async (req, res, next) => {
  const oldToken = req.headers['x-refresh-token'];

  if (!oldToken) return next(TOKEN_REQUIRED);

  const id = await verifyRefreshToken(oldToken);
  const user = await User.findById(id);
  const accessToken = await signAccessToken(user.profile);
  const refreshToken = await signRefreshToken(id);

  await RefreshToken.updateToken(id, refreshToken, oldToken);

  res.json(createResponse(res, { accessToken, refreshToken }));
});

const join = asyncHandler(async (req, res, next) => {
  req.body.role = req.body.role || 'member';

  const { no, password, info, role } = req.body;

  if (!no) return next(REG_NUMBER_REQUIRED);
  if (!password) return next(PASSWORD_REQUIRED);
  if (!info) return next(USER_INFO_REQUIRED);
  if (!info.name) return next(USER_NAME_REQUIRED);
  if (!info.email) return next(USER_EMAIL_REQUIRED);
  if (!info.phone) return next(USER_PHONE_REQUIRED);
  if (!NOT_OPERATOR_ROLES.includes(role)) return next(INVALID_ROLE);
  if (role !== 'member' && !info.department) return next(USER_DEPARTMENT_REQUIRED);

  info.email = info.email.toLowerCase();

  const { email, phone } = info;
  const [exUser, exNo, exEmail, exPhone] = await Promise.all([
    User.findOne({ no }),
    UserInfo.findOne({ no }),
    UserInfo.findOne({ email }),
    UserInfo.findOne({ phone })
  ]);

  if (exUser || exNo) return next(REG_NUMBER_USED);
  if (exEmail) return next(EMAIL_USED);
  if (exPhone) return next(PHONE_NUMBER_USED);

  const user = await User.create({ no, password, role, permissions: [] });
  const { _id: infoId } = await UserInfo.create({ no, ...info, role, user: user._id });

  user.info = infoId;
  await user.save();

  if (info.image)
    await updateFiles(req, infoId, 'UserInfo', [info.image]);

  res.json(createResponse(res));
});

const login = (...roles) => asyncHandler(async (req, res, next) => {
  const { no, password } = req.body;

  if (!no) return next(REG_NUMBER_REQUIRED);
  if (!password) return next(PASSWORD_REQUIRED);

  const exUser = await User.findOne({ no });

  if (!exUser) return next(USER_NOT_FOUND);
  if (roles.length > 0 && !hasRoles(exUser, ...roles)) return next(FORBIDDEN);
  if (!exUser.authenticate(password)) return next(INVALID_PASSWORD);

  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken(exUser.profile), signRefreshToken(exUser._id)
  ]);

  await RefreshToken.updateToken(exUser._id, refreshToken);

  res.json(createResponse(res, { accessToken, refreshToken }));
});

const findRegNo = asyncHandler(async (req, res, next) => {
  const { body: { name, email, phone } } = req;
  let user;

  if (email) {
    user = await UserInfo.findOne({ email });
  } else {
    user = await UserInfo.findOne({ phone });
  }

  if (!user || user.name !== name) return next(USER_INFO_NOT_FOUND);

  res.json(createResponse(res, { no: user.no }));
});

const sendOtp = asyncHandler(async (req, res, next) => {
  const { body: { no, email } } = req;
  const user = await UserInfo.findOne({ email });

  if (!user || user.no !== no) return next(USER_INFO_NOT_FOUND);

  const otp = await Otp.getOtp(user._id);
  const msgBody = `<p>다음 인증번호를 입력해주세요.</p><p>인증번호: [<span style="color: blue;">${otp.code}]</span></p>`;
  await sendMail('인증 번호 전송', msgBody, email);

  res.json(createResponse(res));
});

const checkOtp = asyncHandler(async (req, res, next) => {
  const { no, code } = req.body;
  const user = await UserInfo.findOne({ no });

  if (!user) return next(USER_INFO_NOT_FOUND);

  await validateOtp(user._id, code);

  res.json(createResponse(res));
});

const initPassword = asyncHandler(async (req, res, next) => {
  const { no, code, password } = req.body;
  const userInfo = await UserInfo.findOne({ no });

  if (!userInfo) return next(USER_INFO_NOT_FOUND);

  const otp = await validateOtp(userInfo._id, code);
  const user = await User.findById(userInfo.user);

  if (!user) return next(USER_NOT_FOUND);

  user.password = password;

  await Promise.all([user.save(), otp.deleteOne()]);

  res.json(createResponse(res));
});

const updateMe = asyncHandler(async (req, res, next) => {
  const { body: $set, user } = req;

  // todo: 업데이트 불가능한 속성 제거
  delete $set.user;
  delete $set.role;

  const info = await UserInfo.findById(user.info);

  if (!info) return next(USER_INFO_NOT_FOUND);

  const userInstance = await User.findById(info.user);

  if (!userInstance) return next(USER_NOT_FOUND);

  const { no, email, phone, image } = $set;

  if (email && email.toLowerCase() !== info.email) {
    const exEmail = await UserInfo.findOne({ email });
    if (exEmail) return next(EMAIL_USED);
  }

  if (phone && phone !== info.phone) {
    const exPhone = await UserInfo.findOne({ phone });
    if (exPhone) return next(PHONE_NUMBER_USED);
  }

  if (no && no !== info.no) {
    const [exUser, exNo] = await Promise.all([
      User.findOne({ no }),
      UserInfo.findOne({ no })
    ]);
    if (exUser || exNo) return next(REG_NUMBER_USED);
    userInstance.no = no;
    await userInstance.save();
  }

  if (image && image !== info.image) {
    await updateFiles(req, info._id, 'UserInfo', [image]);
  } else if (!image) {
    await removeFileByUrl(req, info.image);
    info.image = null;
  }

  await info.updateOne({ $set });

  res.json(createResponse(res));
});

const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (!user.authenticate(oldPassword)) return next(INVALID_PASSWORD);

  user.password = newPassword;
  await user.save()

  res.json(createResponse(res));
});

async function validateOtp(user, code) {
  const otp = await Otp.findOne({ user });
  if (!otp || otp.code !== code) throw INVALID_OTP;
  return otp;
}

exports.getMe = getMe;
exports.logout = logout;
exports.validateAccessToken = validateAccessToken;
exports.refreshToken = refreshToken;
exports.join = join;
exports.login = login();
exports.loginOperator = login('admin', 'operator');
exports.findRegNo = findRegNo;
exports.sendOtp = sendOtp;
exports.checkOtp = checkOtp;
exports.initPassword = initPassword;
exports.updateMe = updateMe;
exports.changePassword = changePassword;
