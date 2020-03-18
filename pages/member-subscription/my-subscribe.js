const app = getApp()
const httputil = require('../../utils/httputil.js')
const config = require('../../config.js')
const statusList = [
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
    subscribeInfo: {},
    auctionList: [],
    prefix: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    this.setData({
      'prefix': config.service.ImageUrl
    })
    this.detailget(id);
  },
  detailget(id){
    let that = this;
    httputil.get("/subscribe/detail", { id: id }).then(res => {
      console.log(res)
      if (res.success) {
        if (res.data) {
          let subscribeInfo = res.data.subscribe ? res.data.subscribe : {};
          let auctionList = res.data.subscribeDetailDate;
          let status = '';
          let price = '不限';
          let startPrice = false;
          let endPrice = false;
          let adress = '';
          for (let val of statusList) {
            if (subscribeInfo.stage === val.id) {
              status = val.name;
            }
          }
          if (subscribeInfo.startPrice || subscribeInfo.startPrice === 0) {
            price = subscribeInfo.startPrice + '万以上';
            startPrice = true;
          }
          if (subscribeInfo.endPrice || subscribeInfo.endPrice === 0) {
            price = subscribeInfo.endPrice + '万以下';
            endPrice = true;
          }
          if (endPrice && startPrice) {
            price = subscribeInfo.startPrice + '万~' + subscribeInfo.endPrice + '万';
          }
          if (subscribeInfo.province) {
            adress = subscribeInfo.province;
          }
          if (subscribeInfo.city) {
            adress = subscribeInfo.city;
          }
          if (subscribeInfo.area) {
            adress = subscribeInfo.area;
          }

          subscribeInfo.status = status;
          subscribeInfo.adress = adress;
          subscribeInfo.price = price;
          
          auctionList.forEach((val, key) => {
            let subscribeDetailInfo = val.assetHouse;
            subscribeDetailInfo.forEach((item, index) => {
              let status = item.status + "";
              let statusStr = "";
              switch (status) {
                case "7":
                  statusStr = '看样排期中';
                  break;
                case "8":
                  statusStr = '不安排看样';
                  break;
                case "9":
                  statusStr = '看样预约中';
                  break;
                case "10":
                  statusStr = '预约结束';
                  break;
                case '11':
                  statusStr = '即将开始';
                  break;
                case '12':
                  statusStr = '进行中';
                  break;
                case '13':
                  statusStr = '成交';
                  break;
                case '14':
                  statusStr = '流拍';
                  break;
                case '18':
                  statusStr = '暂缓';
                  break;
                case '15':
                  statusStr = '中止';
                  break;
                case '16':
                  statusStr = '撤回';
                  break;
                default:
                  statusStr = '';
                  break;
              }
              item.statusStr = statusStr
              //起拍价
              let priceA = this.delcommafy(item.startintPrice);
              if (Number(priceA) > 100) {
                priceA = (Number(priceA) / 10000).toFixed(2);
                item.startintPrice = priceA + '万'
              } else {
                priceA = (Number(priceA)).toFixed(2);
                item.startintPrice = priceA
              }
              //成交价
              let priceB = this.delcommafy(item.finalPrice);
              if (Number(priceB) > 100) {
                priceB = (Number(priceB) / 10000).toFixed(2);
                item.finalPrice = priceB + '万'
              } else {
                priceB = (Number(priceB)).toFixed(2);
                item.finalPrice = priceB
              }
            })
          })
          console.log(auctionList, subscribeInfo)
          that.setData({
            subscribeInfo: subscribeInfo,
            auctionList: auctionList
          })
        }
        
      } else {
        wx.showToast({
          title: res.message,
        })
      }
    })
  },
  delcommafy(num) {
    if (num || num == 0) {
      if ((num + "").trim() == "") {
        return "";
      }
      num = num.replace(/,/gi, '');
      return num;
    } else {
      return "";
    }
  },
  detail: function (event) {
    let assetId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../auction/detail?id=' + assetId,
    })
  },
})