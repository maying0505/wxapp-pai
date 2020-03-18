const app = getApp()
const httputil = require('../../utils/httputil.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    redirect: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let redirect = options.redirect;
    console.log(redirect)
    if (redirect) {
      this.setData({
        'redirect': redirect
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getUserInfo(e) {
    let that = this
    wx.login({
      success: res => {
        if (res.code) {
          let code = res.code
          wx.getUserInfo({
            withCredentials: true,
            success: res => {
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
                  app.globalData.userInfo = userinfo;
                  let url = that.data.redirect ? that.data.redirect : '../index/index';
                  let isTab = app.isTab(url);
                  if (isTab) {
                    wx.switchTab({
                      url: url
                    })
                  } else {
                    wx.navigateTo({
                      url: url
                    })
                  }
                } else {
                  wx.showToast({
                    title: res.message ? res.message : '登录授权失败',
                    duration: 1000,
                    success: function() {
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