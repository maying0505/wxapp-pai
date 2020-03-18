const fly = require('./wx.umd.min.js')

var instance = new fly();
// const auctionPublish = 'https://mobile.nengpaifafu.com/page/#/auction/publish/';
const auctionPublish = 'http://test.mobile.nengpaifafu.com/#/auction/publish/';
// instance.config.baseURL = 'http://nengpai.dezhierp.com/paifront'; 
// instance.config.baseURL = 'https://mobile.nengpaifafu.com/paifront';
instance.config.baseURL = 'http://test.mobile.nengpaifafu.com/paifront';
// instance.config.baseURL = 'http://192.168.2.220:9090/paifront';
instance.config.headers["X-Requested-With"] = "XMLHttpRequest";
instance.config.headers["content-type"] = 'application/json;charset=utf-8';
instance.config.headers["Cache-Control"] = "no-cache";
let curUrl = null;
instance.interceptors.request.use(config => {
  curUrl = config.url;
  wx.showLoading({
    title: '加载中',
  })

  if (curUrl.indexOf("login") > -1) {
    wx.setStorageSync('token', "");
  }
  if (curUrl.indexOf("login") < 0) {
    let token = wx.getStorageSync("token") + "";
    config.headers["Authorization"] = token;
    console.log('token',token)
  } 
  return config;
}, err => {
  return Promise.reject(err);
});
instance.interceptors.response.use(res => {
  console.log('headers.token', res.headers.token)
  if (res.headers.token) {
    wx.setStorageSync('token', res.headers.token + "");
  }
  wx.hideLoading();
  return res;
}, err => {
  if (err && err.response) {
    wx.hideLoading();
    let message = ''
    console.log('err.response.status' + err.response.status)


    switch (err.response.status) {
      case 401:
        wx.showModal({
          title: '提示',
          content: '请先登录',
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '../uc/index',
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        message = ''
        break
      case 404:
        message = ''
        break
      case 500:
        message = '服务器内部错误'
        break
      case 501:
        message = '网络未实现'
        break;
      case 502:
        message = '网络错误'
        break;
      case 503:
        message = '服务不可用'
        break;
      case 504:
        message = '网络超时'
        break;
      case 505:
      default:
        message = 'error'
        break;
    }
    if (message) {
      wx.showToast({
        title: message,
      })
    }
  }
  return err;
});


function get(url, param) {
  return new Promise((resolve, reject) => {
    instance.get(url, param).then(res => resolve(res.data))
  })
}


function post(url, param) {
  return new Promise((resolve, reject) => {
    instance.post(url, param).then(res => resolve(res.data))
  })
}


function getCurrentPageUrl() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  return url
}

/*获取当前页带参数的url*/
function getCurrentPageUrlWithArgs() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  var options = currentPage.options //如果要获取url中所带的参数可以查看options

  //拼接url的参数
  var urlWithArgs = url + '?'
  for (var key in options) {
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

  return urlWithArgs
}




module.exports = {
  get: get,
  post: post,
  curUrl: curUrl,
  auctionPublish: auctionPublish,
  getCurrentPageUrl: getCurrentPageUrl,
  getCurrentPageUrlWithArgs: getCurrentPageUrlWithArgs
};