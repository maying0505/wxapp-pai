const app = getApp()
const httputil = require('../../utils/httputil.js')
const distinct = require('../../template/drop-menu.js')
const DATA = require('../../template/data.js')
const config = require('../../config.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeList: [],
    params: {
      userId: ''
    }
  },

  onLoad: function(options) {
    this.getNoticeList();
  },


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
  goDetail(event) {
    let assetId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../auction/detail?id=' + assetId
    })
  },
  getNoticeList() {
    if (app.globalData.userInfo && app.globalData.userInfo.id) {
      this.setData({
        'params.userId': app.globalData.userInfo ? app.globalData.userInfo.id : ''
      })
    } else {
      console.log('userinfo=>' + wx.getStorageSync("user"))
      let userinfo = wx.getStorageSync("user") ? wx.getStorageSync("user") : '';
      console.log('userinfo=>' + userinfo)
      if (userinfo && userinfo.id) {
        this.setData({
          'params.userId': userinfo.id
        })
        app.globalData.userInfo = userinfo
      }
    }
    httputil.get('/notice/list', this.data.params).then(res => {
      if (res.code == 0) {
        if(res.data){
          res.data.forEach((item, index) => {

            let content = JSON.parse(item.content);
            item.content = content;

          })
        }
     
        this.setData({
          'noticeList': res.data
        })
      } else {
        wx.showToast({
          title: res.message
        })
      }
    })
  }
})