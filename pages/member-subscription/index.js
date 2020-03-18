const app = getApp()
const httputil = require('../../utils/httputil.js')
const statusList= [
    {
      id: -1,
      name: '不限'
    },
    {
      id: 0,
      name: '一拍'
    },
    {
      id: 1,
      name: '二拍'
    },
    {
      id: 2,
      name: '变卖'
    }
  ];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    subscribeList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let user = wx.getStorageSync("user") ? wx.getStorageSync("user") : {};
    this.setData({
      userId: user.id ? user.id : '' 
    },function(){
      that.getList();
    })
  },

  adressShow(id){
    return id
  },
  
  getList(){
    let that = this;
    httputil.get("/subscribe/list", { userId: this.data.userId}).then(res => {
      if (res.success) {
          if(res.data){
            let list = res.data;
            list.forEach((item, index) => {
              let status = '';
              let price = '不限';
              let startPrice = false;
              let endPrice = false;
              let adress = '';
              for (let val of statusList) {
                if (item.stage === val.id) {
                  status = val.name;
                }
              }
              if (item.startPrice || item.startPrice === 0) {
                price = item.startPrice + '万以上';
                startPrice = true;
              }
              if (item.endPrice || item.endPrice === 0) {
                price = item.endPrice + '万以下';
                endPrice = true;
              }
              if (endPrice && startPrice){
                price = item.startPrice + '万~' + item.endPrice + '万';
              }
              if (item.province) {
                adress = item.province;
              }
              if (item.city) {
                adress = item.city;
              }
              if (item.area) {
                adress = item.area;
              }

              item.status = status;
              item.adress = adress;
              item.price = price;
            })
            that.setData({
              subscribeList: list
            })
          }
      } else {
        wx.showToast({
          title: res.message,
        })
      }
    })
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
  addMemberSubscription() {//新增订阅
    wx.redirectTo({
      url: '../member-subscription/add-member-subscription?userId=' + this.data.userId,
    })
  },
  cancelMemberSubscription(event){//取消订阅
    let that = this;
    let id = event.currentTarget.dataset.id;
    httputil.post("/subscribe/cancel", {id: id}).then(res => {
      if (res.success) {
        wx.showToast({
          title: '操作成功',
          icon: 'none',
          success: res => {
            that.setData({ subscribeList: [] });
            that.onLoad()
          }
        })
      } else {
        wx.showToast({
          title: res.message,
        })
      }
    })
  },
  subscribeDetail(event) {//跳转详情
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../member-subscription/my-subscribe?id=' + id,
    })
  }
})
  