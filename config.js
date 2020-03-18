const QQMapWX = require('/utils/qqmap-wx-jssdk.min.js');
const MapKey = 'EHYBZ-IT2CP-F37DI-V6YXT-7RAQV-COFZQ';
// const ImageUrl='https://mobile.nengpaifafu.com/img/';
const ImageUrl = 'https://nengpaiimage.oss-cn-shenzhen.aliyuncs.com/img/';
// const ImageUrl = 'http://test.office.nengpaifafu.com/pai-manage/api/common/image/';
const ImageUrl360 = 'https://mobile.nengpaifafu.com/img/';
// const ImageUrl360 = 'http://test.mobile.nengpaifafu.com/img/';
var QQMapAPI = new QQMapWX({
  key: MapKey
});
var config = {
  service: {
    MapKey,
    QQMapAPI,
    ImageUrl,
    ImageUrl360,
  }
};
module.exports = config;