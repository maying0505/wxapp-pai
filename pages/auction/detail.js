const app = getApp()
const httputil = require('../../utils/httputil.js')
const config = require('../../config.js')

Page({
  data: {
    ifCall: false,
    auctionDetail: null,
    assetId:'',
    smcodebtnTxt: '获取短信验证码',
    prefix: '',
    prefix360: '',
    isGetSmCode: false,
    params: {
      timeId: "",
      mobile: "",
      smcode: "",
      name: "",
      assetId: "",
      userId: "",
      time: '',
      formId: '',
      page: '../books/index',
      openid: '',
      address: '',
      title: ''
    },
    smcode: {
      mobile: "",
      type: "ASSETBOOK"
    },
    authTime: 60,
    isBookSubmit: false,
    hasSmCode: false,
    dialog: false
  },
  onLoad: function(options) {
    this.setData({
      'prefix': config.service.ImageUrl
    })
    this.setData({
      'prefix360': config.service.ImageUrl360
    })
    let id = options.id;
    if(id){
      this.setData({
        'assetId': id,
      })
    }else{
      wx.showToast({
        title: '参数错误[id为空]',
      })
    }
   this.auctionDetail(id);
  },

  onReady: function() {

  },

  onShow: function() {

  },
  onHide: function() {

  },
  onUnload: function() {

  },

  onPullDownRefresh: function() {
    this.auctionDetail(this.data.auctionDetail.id)
    wx.stopPullDownRefresh();
  },

  onReachBottom: function() {

  },
  onShareAppMessage: function() {
    let assetId = this.data.assetId
    console.log(assetId)
    return {
      title: '能拍法服',
      path: 'pages/index/index?assetId=' + assetId 
    }
  },
  jumpCustomerService() {
    wx.navigateTo({
      url: "../auction/customer-service?assetId=" + this.data.auctionDetail.id
    })
  },
  seeContent(event) {
    let type = event.currentTarget.dataset.key;
    if (type) {
      let articleUrl = type == 5 ? httputil.auctionPublish + this.data.auctionDetail.id+'?isWeapp=1':'';
      if (type === '1' || type === '2') {
        wx.navigateTo({
          url: "../auction/picture?type=" + type + "&assetId=" + this.data.auctionDetail.id
        })
      } else if (type === '3' || type === '4' || type === '5') {
        wx.navigateTo({
          url: "../auction/article?type=" + type + "&assetId=" + this.data.auctionDetail.id + "&articleUrl=" + articleUrl
        })
      } 
    }
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
  auctionDetail(id) {
    console.log('auction detail' + id)
    if (id) {
      let params = {
        assetId: id
      }
      httputil.get("/asset/detail", params).then(res => {
        if (res.code == 0) {
          res.data.statusStr = this.statusStr(res.data.status)
          //起拍价
          let priceA = this.delcommafy(res.data.startintPrice);
          if (Number(priceA) > 100) {
            priceA = (Number(priceA) / 10000).toFixed(2);
            res.data.startintPrice = priceA + '万'
          } else {
            priceA = (Number(priceA)).toFixed(2);
            res.data.startintPrice = priceA
          }
          //成交价
          let priceB = this.delcommafy(res.data.finalPrice);
          if (Number(priceB) > 100) {
            priceB = (Number(priceB) / 10000).toFixed(2);
            res.data.finalPrice = priceB + '万'
          } else {
            priceB = (Number(priceB)).toFixed(2);
            res.data.finalPrice = priceB
          }
          this.setData({
            ifCall: res.data3,
            auctionDetail: res.data,
            'params.assetId': res.data.id
          })
        } else {
          wx.showToast({
            title: res.message,
          })
        }
      })
    } else {
      wx.showToast({
        title: '参数错误',
      })
    }
  },
  statusStr(status){
    let statusStr = "";
    switch (status) {
      case "7":
        statusStr = "看样排期中";
        break;
      case "8":
        statusStr = "不安排看样";
        break;
      case "9":
        statusStr = "看样预约中";
        break;
      case "10":
        statusStr = "预约结束";
        break;
      case "11":
        statusStr = "即将开始";
        break;
      case "12":
        statusStr = "进行中";
        break;
      case "13":
        statusStr = "成交";
        break;
      case "14":
        statusStr = "流拍";
        break;
      case "18":
        statusStr = "暂缓";
        break;
      case "15":
        statusStr = "中止";
        break;
      case "16":
        statusStr = "撤回";
        break;
      default:
        statusStr = "";
        break;
    }
    return statusStr;
  },
  openMap(e) {
    var latitude = this.data.auctionDetail.latitude
    var longitude = this.data.auctionDetail.longtitude

    if(latitude&&longitude){
      wx.openLocation({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        scale: 28,
        name: '我在这里',
        address: this.data.auctionDetail.locationName,
        success: function (res) {
          console.log(res)
        },

        fail: function (err) {
          console.log(err)
        },
        complete: function (info) {
          console.log(info)
        },
      })
    }else{
      wx.showToast({
        title: '位置信息错误',
      })
    }

  },
  previewImg(e) {
    let index = e.currentTarget.dataset.index;
    let files = this.data.auctionDetail.files;
    let pictures = [];

    files.forEach((item, index) => {
      pictures.push(this.data.prefix+item.thumbFileName)
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
  bookSubmit(e) {
    let paramsData = e.detail.value
    let formId = e.detail.formId
    console.log(paramsData)
    if (this.data.isBookSubmit) return;
    this.setData({
      'isBookSubmit': true
    });
    if (this.data.params.timeId == "") {
      wx.showToast({
        title: '请选择看样时间',
      })
      this.setData({
        'isBookSubmit': false
      });
      return;
    } else if (paramsData.name == "") {
      wx.showToast({
        title: '请填写预约人姓名',
      })
      this.setData({
        'isBookSubmit': false
      });
      return;
    } else if (paramsData.mobile == "") {
      wx.showToast({
        title: '请填写看样手机号码',
      })
      this.setData({
        'isBookSubmit': false
      });
      return;
    } else if (!this.isMobile(paramsData.mobile)) {
      wx.showToast({
        title: '请填写正确的手机号码',
      })
      this.setData({
        'isBookSubmit': false
      });
      return;
    } else if (!this.data.hasSmCode) {
      wx.showToast({
        title: '请获取短信验证码',
      })
      this.setData({
        'isBookSubmit': false
      });
      return;
    } else if (paramsData.smcode == "") {

      wx.showToast({
        title: '请填写验证码',
      })
      this.setData({
        'isBookSubmit': false
      });
      return;
    }


    this.setData({
      'params.name': paramsData.name,
      'params.smcode': paramsData.smcode,
      'params.mobile': paramsData.mobile,
      'params.formId': formId,
      'params.title': this.data.auctionDetail.baseinfo.subjectMatterName,
      'params.address': this.data.auctionDetail.baseinfo.province + this.data.auctionDetail.baseinfo.city + this.data.auctionDetail.baseinfo.area + this.data.auctionDetail.baseinfo.address
    })

    console.log(this.data.params)
    httputil.get("/book/add", this.data.params).then(res => {
      this.setData({
        'isBookSubmit': false
      });
      this.setData({
        'dialog': false
      });

      let auctionId = this.data.auctionDetail.baseinfo.id
      let that = this
      if (res.code == 0) {
        wx.showModal({
          title: '提示',
          content: '预约成功',
          success() {
            that.onLoad({
              id: auctionId
            })
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: res.message,
          success() {
            that.onLoad({
              id: auctionId
            })
          }
        })
      }


    })

  },
  bookClick() {
    if(this.data.auctionDetail.status!=9) return
    if (this.data.auctionDetail.isBooked) {
      wx.showToast({
        title: '您已经预约过了',
      })
    } else {

      // let user = wx.getStorageSync("user") ?
      //   wx.getStorageSync("user") :
      //   "";

      // if (user && user.id) {
      //   this.setData({
      //     'params.userId': user.id,
      //     'params.openid': user.openid
      //   })

      //   this.setData({
      //     'dialog': true
      //   })
      // } else {
      //   wx.navigateTo({
      //     url: '../uc/login?redirect=../auction/detail?id=' + this.data.auctionDetail.id,
      //   })
      // }

      wx.navigateTo({
        url: '../auction/book?assetId='+this.data.auctionDetail.id,
      })
    }
  },
  img360Click(e) {
    let url = e.currentTarget.dataset.url;
    // url = url || 'http://www.detu.com/pano/show/499960';
    if(url){
      wx.navigateTo({
        url: 'img360?url=' + url
      })
    }
  },
  seeRule() {
    wx.navigateTo({
      url: 'tell-article',
    })
  },
  call(event) {
    if (!this.data.ifCall) {
      return;
    }
    let phone = event.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  }
})