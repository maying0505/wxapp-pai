const httputil = require('utils/httputil.js')
App({
  onLaunch: function() {

  },
  globalData: {
    userInfo: null
  },
  isTab(url) {
    let tabs = ['uc/index', 'index/index', 'books/index'];
    let isTab = false;
    for (let i = 0; i < tabs.length; i++) {
      if (url.indexOf(tabs[i]) > 0) {
        isTab=true;
        break;
      }
    }
    return isTab;
  },
  getAuthKey() {
    return new Promise((resolve, reject) => {
      let token = wx.getStorageSync('token');
      let user = wx.getStorageSync('user') ? JSON.parse(wx.getStorageSync('user')) : '';
      if (user) {
        let userId = user.id;
        if (token && userId) {
          let res = {
            code: 200,
            data: {
              token: token,
              user: user
            }
          }
          resolve(res);
        } else {
          wx.login({
            success: res => {
              if (res.code) {
                wx.getUserInfo({
                  withCredentials: true,
                  success() {

                  }
                })
              } else {
                wx.showToast({
                  title: '',
                })
              }
            },
            fail: res => {

            }
          })
        }
      }
    })
  }
})