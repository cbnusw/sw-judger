const { createSchema } = require('../../helpers');
const AddressSchema = require('./common/address.schema');
const GeometrySchema = require('./common/geometry.schema');

const {
  ORG_NAME: name,
  ORG_SERVICE_NAME: serviceName,
  ORG_REG_NUMBER: regNumber,
  ORG_EMAIL: email,
  ORG_TEL: tel,
  ORG_ADDRESS_BASIC: basic,
  ORG_ADDRESS_DETAIL: detail,
  ORG_ADDRESS_ENG: eng,
  ORG_ADDRESS_POST_CODE: postCode,
  ORG_ADDRESS_LOC_LNG: lng,
  ORG_ADDRESS_LOC_LAT: lat,
} = require('../../../env');

const schema = createSchema({
  name: String,             // 회사 또는 조직명
  serviceName: String,      // 서비스 또는 사업명
  regNumber: String,        // 사업자번호
  email: String,            // 대표 이메일 주소
  tel: String,              // 대표 전화번호
  address: AddressSchema,   // 회사 주소
  location: GeometrySchema, // 회사 위치(위/경도 좌표)
});

schema.statics.get = async function () {
  let org = await this.findOne();

  if (!org) org = await this.create({
    name,
    serviceName,
    regNumber,
    email,
    tel,
    address: {
      basic,
      detail,
      eng,
      postCode,
    },
    location: {
      coordinates: [lng, lat]
    }
  });

  return org;
};

module.exports = schema;
