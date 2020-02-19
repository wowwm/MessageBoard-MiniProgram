
const cloud = require('wx-server-sdk')
const {
  WXMINIUser,
  WXMINIQR
} = require('wx-js-utils');

cloud.init()

const appId = 'wx4cc83a83e0787404'; // 小程序 appId
const secret = '8d3409722de0b26c83d110e82085f210'; // 小程序 secret


exports.main = async (event, context) => {

  // 获取小程序码，A接口
  let wXMINIUser = new WXMINIUser({
    appId,
    secret
  });

  // 一般需要先获取 access_token
  let access_token = await wXMINIUser.getAccessToken();
  let wXMINIQR = new WXMINIQR();

  let qrResult = await wXMINIQR.getMiniQRLimit({
    access_token,
    path:'pages/msgPages/msgPages?id=ebeb6445-d8b2-4f45-8121-eeee1e74916e'
  });

  return await cloud.uploadFile({
    cloudPath:`${event.id}.jpg`,
    fileContent: qrResult
  })
}