const app = getApp()
const httputil = require('../../utils/httputil.js')


// pages/books/checkin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    params: {
      userId: '',
      assetId: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let assetId = options.assetId;
    let userinfo = wx.getStorageSync("user") ? wx.getStorageSync("user") : '';

    if (userinfo && userinfo.id) {
      this.setData({
        'params.userId': userinfo.id,
        'params.assetId': assetId
      })
      app.globalData.userInfo = userinfo
      this.checkin();
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
      // wx.navigateTo({
      //   url: '../uc/login?redirect=../books/checkin?assetId=' + assetId
      // })
    }
  },
  checkin() {

    httputil.get("/book/checkin", this.data.params).then(res => {
      let assetId = this.data.params.assetId
      if (res.code == 0) {
        let that = this
        wx.showModal({
          title: '提示',
          content: '签到成功',
          showCancel: false,
          success: function(d) {
            if (d.confirm) {
              wx.navigateTo({
                url: '../auction/detail?id=' + assetId,
              })
            }
          }
        })

      } else {
        if (res.code == 30014) {
          wx.showModal({
            title: '提示',
            content: res.message,
            showCancel: false,
            success: function (d) {
              if (d.confirm) {
                wx.navigateTo({
                  url: '../auction/book?assetId=' + assetId,
                })
              }
            }
          })
        }else{
          wx.showToast({
            title: '签到失败'
          })
        }
      }
    })
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

  }
})