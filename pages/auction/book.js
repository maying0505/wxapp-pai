const app = getApp()
const httputil = require('../../utils/httputil.js')
const config = require('../../config.js')



Page({

  /**
   * 页面的初始数据
   */
  data: {
    dialog: false,
    smcodebtnTxt: '获取短信验证码',
    isGetSmCode: false,
    times: [],
    index: 0,
    params: {
      timeId: "",
      mobile: "",
      smcode: "",
      name: "",
      assetId: "",
      time: '',
      formId: '',
      page: '../books/index'
    },
    smcode: {
      mobile: "",
      type: "ASSETBOOK"
    },
    authTime: 60,
    isBookSubmit: false,
    ifReadBook: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let assetId = options.assetId;
    if (assetId) {
      this.setData({
        'params.assetId': assetId,
        'dialog': true
      })

      this.getTimes(assetId)
    } else {
      wx.showToast({
        icon: 'none',
        title: '参数错误',
      })
      wx.navigateBack()
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

  },
  /**
			 * 看样日期选择
			 */
  bindPickerChange: function (e) {
    this.setData({
      index: e.target.value,
      'params.timeId': this.data.times[e.target.value].id,
      'params.time': this.data.times[e.target.value].inquestDate + ' 至 ' + this.data.times[e.target.value].endDate
    })
  },
  getTimes(assetId) {
    let params = {
      'assetId': assetId
    }
    this.setData({
      'params.assetId': assetId
    })
    httputil.get("/asset/times", params).then(res => {
      if (res.code == 0) {
        if (res.data.length > 0) {
          let timesB = [];
          res.data.forEach((item, index) => {
            timesB.push({
              ...item,
              'time': item.inquestDate + ' 至 ' + item.endDate
            })
          })
          this.setData({
            'times': timesB,
            'params.timeId': res.data[0].id,
            'params.time': res.data[0].inquestDate + ' 至 ' + res.data[0].endDate
          })
          console.log('times', timesB)
        } else {
          wx.showModal({
            title: '提示',
            content: '还没有预约时间',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '../auction/detail?id=' + assetId
                })
              } else {
                wx.redirectTo({
                  url: '../auction/detail?id=' + assetId
                })
              }
            }
          })
        }
      } else {
        wx.showToast({
          icon: 'none',
          title: res.message,
        })
      }
    })
  },
  bookClick() {
    if (this.data.auctionDetail.isBooked) {
      wx.showToast({
        icon: 'none',
        title: '您已经预约过了',
      })
    } else {

      let user = wx.getStorageSync("user") ?
        wx.getStorageSync("user") :
        "";
      console.log(user)
      if (user && user.id) {
        this.setData({
          'params.userId': user.id,
          'params.openid': user.openid,
          'dialog': true
        })
      } else {
        wx.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 2000
        })
        // wx.navigateTo({
        //   url: '../uc/login?redirect=../auction/detail?id=' + this.data.auctionDetail.baseinfo.id,
        // })
      }
    }
  },
  closeDialog() {
    wx.navigateBack()
  },
  openMap(e) {
    var latitude = e.currentTarget.dataset.lat ? e.currentTarget.dataset.lat : 102.72;
    var longitude = e.currentTarget.dataset.long ? e.currentTarget.dataset.longitude : 25.05;

    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 28,
      name: '我在这里',
      success: function(res) {
        console.log(res)
      },

      fail: function(err) {
        console.log(err)
      },
      complete: function(info) {
        console.log(info)
      },
    })
  },
  showOptions() {
    if (this.data.options) {
      this.setData({
        'options': false
      })
    } else {
      this.setData({
        'options': true
      })
    }
  },
  optionClick(e) {
    let timeid = e.currentTarget.dataset.timeid;
    let time = e.currentTarget.dataset.time;
    this.setData({
      'params.timeId': timeid,
      'params.time': time
    })
    this.setData({
      'options': false
    })
  },
  isMobile(mobile) {
    const mobile_regex = /^((1[0-9]))\d{9}$/;
    return mobile_regex.test(mobile);
  },
  bookSubmit(e) {
    let paramsData = e.detail.value
    let formId = e.detail.formId
    if (this.data.isBookSubmit) return;
    this.setData({
      'isBookSubmit': true
    });


    let user = wx.getStorageSync("user");
    let userId = '';
    let openid = ''
    if (user) {
      userId = user.id;
      openid = user.openid;
    }

    this.setData({
      'params.userId': userId,
      'params.openid': openid
    })



    if (this.data.params.timeId == "") {
      wx.showToast({
        icon: 'none',
        title: '请选择看样时间',
      })
      this.setData({
        'isBookSubmit': false
      });
      return;
    } else if (paramsData.name == "") {
      wx.showToast({
        icon: 'none',
        title: '请填写预约人姓名',
      })
      this.setData({
        'isBookSubmit': false
      });
      return;
    } else if (paramsData.mobile == "") {
      wx.showToast({
        icon: 'none',
        title: '请填写看样手机号码',
      })
      this.setData({
        'isBookSubmit': false
      });
      return;
    } else if (!this.isMobile(paramsData.mobile)) {
      wx.showToast({
        icon: 'none',
        title: '请填写正确的手机号码',
      })
      this.setData({
        'isBookSubmit': false
      });
      return;
    } else if (!this.data.isGetSmCode) {
      wx.showToast({
        icon: 'none',
        title: '请获取短信验证码',
      })
      this.setData({
        'isBookSubmit': false
      });
      return;
    } else if (paramsData.smcode == "") {
      wx.showToast({
        icon: 'none',
        title: '请填写验证码',
      })
      this.setData({
        'isBookSubmit': false
      });
      return;
    } else if (!this.data.ifReadBook) {
      wx.showToast({
        icon: 'none',
        title: '请阅读并接受《看样告知书》',
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
      'params.formId': formId
    })



    let auctionId = this.data.params.assetId
    httputil.get("/book/add", this.data.params).then(res => {
      this.setData({
        'isBookSubmit': false
      });
      // this.setData({
      //   'dialog': false
      // });

      let that = this
      if (res.code == 0) {
        wx.showModal({
          title: '提示',
          content: '预约成功',
          success() {
            wx.redirectTo({
              url: '../auction/detail?id=' + auctionId,
            })
          }
        })
      } else {
        wx.showToast({
          icon:'none',
          title: res.message,
        })
      }


    })

  },
  getCode() {
    console.log(this.data.params)
    if (this.data.params.mobile == "") {
      wx.showToast({
        icon: 'none',
        title: '请输入手机号码',
      })
      return;
    }
    if (!this.isMobile(this.data.params.mobile)) {
      wx.showToast({
        icon: 'none',
        title: '请填写正确的手机号码',
      })
      return;
    }

    if (this.data.isGetSmCode) return;
    this.setData({
      'isGetSmCode': true,
      'smcode.mobile': this.data.params.mobile
    });
    httputil.get("/sm/send", this.data.smcode).then(res => {
      if (res.code == 0) {

        var authTime=60
        var timer = setInterval(()=> {
          this.setData({ 
            'smcodebtnTxt': (--authTime) + 's后重新获取',
            'isGetSmCode': true
          })
          if (authTime == -1) { 
            clearInterval(timer)
            this.setData({
              'smcodebtnTxt': '获取验证码',
              'isGetSmCode': false
            })
          }
        }, 1000)
      } else {
        wx.showToast({
          icon: 'none',
          title: res.message,
        })
      }
    })
  },
  inputMobile(e) {
    console.log(e)

    var mobile = e.detail.value;
    this.setData({
      'params.mobile': mobile
    })
  },
  bookNoticeChecked(){
    this.setData({
      ifReadBook: !this.data.ifReadBook
    })
  },
  seeRule() {
    wx.navigateTo({
      url: '../auction/rule',
    })
  }
})