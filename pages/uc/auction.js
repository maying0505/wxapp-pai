const app = getApp()
const httputil = require('../../utils/httputil.js')
const params = {
  userId: ''
};

const config = require('../../config.js')


Page({
  data: {
    auctionList: [],
    params: params
  },

  onLoad: function(options) {
    this.setData({
      'prefix': config.service.ImageUrl
    })
    this.getAuctionList();
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

  getAuctionList() {
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

    httputil.get("/book/list", this.data.params).then(res => {
      if (res.code == 0) {
        if (res.data) {
          res.data.forEach((item, index) => {
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

          this.setData({
            auctionList: res.data
          })
          
        } else {
          
        }
      } else {
        wx.showToast({
          title: res.message,
        })
      }
    })
  },
  detail: function(event) {
    let assetId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../auction/detail?id=' + assetId,
    })
  }
})