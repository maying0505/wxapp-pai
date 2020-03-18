const app = getApp()
const httputil = require('../../utils/httputil.js')
const config = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    params:{
      assetId:'',
      timeId:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    let assetId= options.assetId?options.assetId:'';
    let timeId=options.timeId?options.timeId:'';
    this.setData({
      'prefix': config.service.ImageUrl
    })
    if (assetId&&timeId){
      let p = { assetId: assetId }
      httputil.get("/asset/detail", p).then(res => {
        if (res.code == 0) {
          this.setData({
            auctionDetail: res.data,
          })
        } else {
          wx.showToast({
            title: res.message,
          })
        }
      })
    }else{
      wx.showToast({
        icon: 'none',
        title: '参数错误,无法签到',
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

  }
})