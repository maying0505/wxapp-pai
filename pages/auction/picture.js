const httputil = require('../../utils/httputil.js')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    imageList: [],
    prefix: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      'prefix': config.service.ImageUrl
    })
    let type = options.type;
    let assetId = options.assetId;
    this.title(type);
    this.getArticle(type, assetId);
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
  title(type) {
    let content = "";
    switch (type) {
      case "1":
        content = "公告";
        break;
      case "2":
        content = "须知";
        break;
    }
    wx.setNavigationBarTitle({
      title: content
    })
  },
  previewImg(e) {
    let index = e.currentTarget.dataset.index;
    let files = this.data.imageList;
    let pictures = [];

    files.forEach((item, index) => {
      pictures.push(this.data.prefix + item.waterMarkImage)
    })
    wx.previewImage({
      current: pictures[index],
      urls: pictures,
      success: function () {

      },
      fail: function () {
        wx.showToast({
          title: '图片预览错误',
        })
      }
    })
  },
  getArticle(type, assetId) {
    let params = {
      assetId: assetId
    };
    let getUrl = '';
    if (type === '1') {
      getUrl = "/asset/article2 "
    } else if (type === '2') {
      getUrl = "/asset/article3 "
    }
    let that = this
    httputil.get(getUrl, params).then(res => {
      if (res.code == 0) {
        if (res.data) {
          this.setData({
            imageList: res.data
          })
        }
      } else {
        wx.showToast({
          title: res.message,
        })
      }
    })



  }
})