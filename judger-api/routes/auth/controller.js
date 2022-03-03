const asyncHandler = require('express-async-handler');
const axios = require('axios');
const { AUTH_APP_HOST } = require('../../env');
const { UserInfo } = require('../../models');
const { createResponse } = require('../../utils/response');

const getMe = asyncHandler(async (req, res, next) => {
  const { user } = req;

  const info = await UserInfo.findById(user.info);
  res.json(createResponse(res, info));
});

const login = asyncHandler(async (req, res, next) => {
  const { body: { no, password } } = req;

  try {
    const response = await axios.post(
      `${AUTH_APP_HOST}/login`,
      { no, password }
    );

    const { data: tokens } = response.data;
    const { accessToken } = tokens;

    const response2 = await axios.get(
      `${AUTH_APP_HOST}/me`,
      {
        headers: { 'x-access-token': accessToken }
      }
    );

    const { data: me } = response2.data;

    const { info, permissions } = me;
    const exInfo = await UserInfo.findById(info._id);
    if (exInfo) {
      await exInfo.updateOne({ $set: { ...info, permissions } });
    } else {
      await UserInfo.create({ ...info, permissions });
    }

    res.json(createResponse(res, tokens, 201));
  } catch (e) {
    next(e.response && e.response.data || e);
  }
});

exports.getMe = getMe;
exports.login = login;
