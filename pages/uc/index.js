const app = getApp()
const httputil = require('../../utils/httputil.js')

Page({

  data: {
    user: null,
    ifLogin:false
  },
  onLoad: function(options) {
    this.getUserInfo();
  },

  onReady: function() {

  },

  onShow: function() {

  },


  onHide: function() {

  },

  onUnload: function() {

  },

  onPullDownRefresh: function() {

  },

  onReachBottom: function() {

  },


  onShareAppMessage: function() {

  },
  logout() {
    wx.navigateTo({
      url: '../index/index',
    })
  },
  getUserInfo() {

    if (app.globalData.userInfo) {
      this.setData({
        'user': app.globalData.userInfo
      })
    } else {
      console.log('userinfo=>' + wx.getStorageSync("user").id)
      let userinfo = wx.getStorageSync("user") ? wx.getStorageSync("user") : '';
      this.setData({
        'user': userinfo
      })
      if (userinfo) {
        app.globalData.userInfo = userinfo;
      } else {
        
        // wx.redirectTo({
        //   url: '../uc/login?redirect=../uc/index',
        // })
      }
    }
  },
  call(event){
    let phone = event.currentTarget.dataset.phone;
      wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  ifLoginShow(){
    if(this.data.user){
      return
    }
    this.setData({
      ifLogin: true
    })
  },
  ifLogin(event){
    this.setData({
      ifLogin: false
    })
  },
  loginDo(e) {
    console.log(e)
    this.setData({
      ifLogin: false
    })
    let that = this
    wx.login({
      success: res => {
        console.log(res)
        if (res.code) {
          let code = res.code;
          wx.getUserInfo({
            withCredentials: true,
            success: res => {
              console.log(res)
              let params = {
                code: code,
                encryptedData: res.encryptedData,
                iv: res.iv
              }
              httputil.get('wx/weapp/auth', params).then(res => {
                console.log(res)
                if (res.code == 0) {
                  let userinfo = res.data;
                  wx.setStorageSync("user", userinfo);
                  that.setData({
                    user: userinfo
                  })
                  app.globalData.userInfo = userinfo;
                } else {
                  wx.showToast({
                    title: res.message ? res.message : '登录授权失败',
                    duration: 1000,
                    success: function () {
                      // wx.redirectTo({
                      //   url: '../uc/login',
                      // })
                    }
                  })
                }
              });
            }
          })
        } else {
          wx.showToast({
            title: '获取用户登录态失败',
          })
        }
      },
      fail: res => {
        wx.showToast({
          icon: 'none',
          title: res.errMsg,
        })
      }
    })
  }
})