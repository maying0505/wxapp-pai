const httputil = require('../../utils/httputil.js')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listInfo: [],
    assetId: '',
    inputValue: null,
    ifFocus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let assetId = options.assetId;
    this.getList(assetId);
    this.setData({
      'assetId': assetId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getList(assetId) {
    let params = {
      assetId: assetId
    };
    let that = this
    httputil.get('/asset/messageList', params).then(res => {
      if (res.success) {
        if (res.data) {
          that.setData({
           'listInfo': res.data
         })
        }
      } else {
        wx.showToast({
          title: res.message,
        })
      }
    })
  },
  inputBlur() {
    this.setData({
      ifFocus: false
    })
  },
  inputFocus() {
    this.setData({
      ifFocus: true
    })
  },
  clearInputEvent: function (res) {
    this.setData({
      'inputValue': ''
    })
  },
  bookSubmit(e) {
    console.log(e)
    let question = e.detail.value.question;
    console.log(this)
    let that = this
    httputil.get('/asset/message', {
      question: question,
      assetId: that.data.assetId
    }).then(res => {
      if (res.success) {
        this.clearInputEvent();
        wx.showToast({
          title: '您的提问已成功提交，建议您稍后查看解答，谢谢！',
          duration: 3000,
          icon: 'none'
        })

      } else {
        wx.showToast({
          title: res.message,
        })
      }
      this.setData({
        ifFocus: false
      })
    })
  }
})