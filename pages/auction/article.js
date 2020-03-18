const WxParse = require('../../utils/wxParse/wxParse.js');

const httputil = require('../../utils/httputil.js')



Page({

  /**
   * 页面的初始数据
   */
  data: {
    auctionArticleTitle: '',
    content: '',
    type: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let type = options.type;
    let articleUrl =options.articleUrl
    let assetId = options.assetId;
    if (type) {
      this.setData({
        'type': type
      })

      console.log('-------------' + articleUrl+'--------------------')
      type!=5?this.getArticle(type, assetId):'';

      WxParse.wxParse('article', 'html', this.data.content, this, 5);
    }
    if(articleUrl){
      this.setData({
        'articleUrl':articleUrl
      })
    }
    this.title(type);

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
  title(type) {
    let content = "";
    switch (type) {
      case "1":
        content = "公告";
        break;
      case "2":
        content = "须知";
        break;
      case "3":
        content = "重要提示";
        break;
      case "4":
        content = "其他说明";
        break;
      case "5":
        content = "标的物介绍";
        break;
    }
    wx.setNavigationBarTitle({
      title: content
    })
  },
  getArticle(type, assetId) {
    let params = {
      type: type,
      assetId: assetId
    };
    let that = this
    httputil.get("/asset/article", params).then(res => {
      if (res.code == 0) {
        if (res.data) {
          WxParse.wxParse('article', 'html', res.data, that, 5);
        }
      } else {
        wx.showToast({
          title: res.message,
        })
      }
    })



  }
})