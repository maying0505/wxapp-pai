const app = getApp()
const httputil = require('../../utils/httputil.js')
const distinct = require('../../template/drop-menu.js')
const DATA = require('../../template/data.js')
const config = require('../../config.js')
const qqmapsdk = config.service.QQMapAPI
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [],
    multiArrayB: [],
    multiIndex: [0, 0, 0],
    multiIndexB: [0, 0, 0],
    curProvince: '',
    curCity: '',
    curArea: '',
    userId: '',
    startPrice: '',
    endPrice: '',
    phone: '',
    name: '',
    style: 1,
    isPopupShow1: false,
    provinces: '',
    cities: '',
    areas: '',
    province: "",
    city: "",
    area: "",
    toViewP: '',
    toViewA: '',
    toViewC: '',
    distinctStr: '',
    curStatus: -1,
    curPushCycle: 1,
    pushCycleList: [
      {
        id: 1,
        name: '一周'
      },
      {
        id: 2,
        name: '半个月'
      },
    ],
    statusList: [
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
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId: options.userId
    })
    wx.showLoading({ title: '加载中' })
    this.getLocation();
  },
  startPriceInput(e){
    let val = e.detail.value;
    this.setData({
      startPrice: val
    })
  },
  endPriceInput(e) {
    let val = e.detail.value;
    this.setData({
      endPrice: val
    })
  },
  nameInput(e) {
    let val = e.detail.value;
    this.setData({
      name: val
    })
  },
  phoneInput(e) {
    let val = e.detail.value;
    this.setData({
      phone: val
    })
  },
  pushCycleClick(event) {
    let id = event.currentTarget.dataset.id;
    this.setData({
      curPushCycle: id
    })
  },
  statusClick(event) {
    let id = event.currentTarget.dataset.id;
    this.setData({
      curStatus: id
    })
  },
  bindMultiPickerChange: function (event) {
    this.setData({
      multiArrayB: JSON.parse(JSON.stringify(this.data.multiArray)),
      multiIndexB: JSON.parse(JSON.stringify(this.data.multiIndex)),
      curProvince: this.data.multiArray[0][this.data.multiIndex[0]].name,
      curCity: this.data.multiArray[1][this.data.multiIndex[1]].name,
      curArea: this.data.multiArray[2][this.data.multiIndex[2]].name,
    })
  },
  bindMultiPickerCancel: function (event) {
    this.setData({
      multiArray: JSON.parse(JSON.stringify(this.data.multiArrayB)),
      multiIndex: JSON.parse(JSON.stringify(this.data.multiIndexB))
    })

  },
  bindMultiPickerColumnChange: function (e) {
    let _multiIndex = this.data.multiIndex;
    _multiIndex[e.detail.column] = e.detail.value;
    let _multiArray = this.data.multiArray;

    switch (e.detail.column) {
      case 0: //拖动第1列
        _multiArray[1] = DATA.getDistincts(this.data.multiArray[0][e.detail.value]['key'], DATA.distincts);
        _multiArray[2] = DATA.getDistincts(this.data.multiArray[1][0]['key'], DATA.distincts)
        _multiIndex.splice(1, 1, 0)
        _multiIndex.splice(2, 1, 0)
        break
      case 1: //拖动第2列
        _multiArray[2] = DATA.getDistincts(this.data.multiArray[1][e.detail.value]['key'], DATA.distincts)
        _multiIndex.splice(2, 1, 0)
        break
      case 2: //拖动第2列
        _multiIndex.splice(2, 1, e.detail.value)
        break
    }
    this.setData({
      multiIndex: _multiIndex,
      multiArray: _multiArray
    })
  },
  // 微信获得经纬度
  getLocation: function () {
    let vm = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(JSON.stringify(res))
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy;
        vm.getLocal(latitude, longitude)
      },
      fail: function (res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },
  // 获取当前地理位置
  getLocal: function (latitude, longitude) {
    let vm = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        let district = res.result.ad_info.district
        let adcode = res.result.ad_info.adcode
        let cityCode = distinct.getCode1(province);
        let provinceCode = 100000;
        let areaCode = distinct.getCode1(city);
        const multiArray_0 = DATA.getDistincts(provinceCode, DATA.distincts);
        const multiArray_1 = DATA.getDistincts(cityCode, DATA.distincts);
        const multiArray_2 = DATA.getDistincts(areaCode, DATA.distincts);
        const multiIndex_0 = distinct.getCodeIndex(province, multiArray_0);
        const multiIndex_1 = distinct.getCodeIndex(city, multiArray_1);
        const multiIndex_2 = distinct.getCodeIndex(district, multiArray_2);

        vm.setData({
          multiArray: [multiArray_0, multiArray_1, multiArray_2],
          multiArrayB: [multiArray_0, multiArray_1, multiArray_2],
          multiIndex: [multiIndex_0, multiIndex_1, multiIndex_2],
          multiIndexB: [multiIndex_0, multiIndex_1, multiIndex_2]
        })

        vm.setData({
          curProvince: province,
          curCity: city,
          curArea: district,
        }, function () {
          vm.initData();
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  },
  initData() {
    if (this.data.area) {
      this.setData({
        'areas': distinct.getData(distinct.getCode1(this.data.city)),
        'toViewA': distinct.getCode(this.data.area)
      });
    }
    if (this.data.city) {
      this.setData({
        'cities': distinct.getData(distinct.getCode(this.data.province)),
        'toViewC': distinct.getCode(this.data.city)
      });
    }
    if (this.data.province) {
      this.setData({
        'provinces': distinct.getData(),
        'toViewP': distinct.getCode(this.data.province)
      });
    }

    this.setData({
      'distinctStr': this.data.province + ' ' + this.data.city + ' ' + this.data.area
    })
    wx.hideLoading()
  },
  chooseProvince(event) {
    var choosen = event.currentTarget.dataset.province;
    // if (choosen == this.data.province) return;
    console.log(choosen)
    this.setData({
      'province': choosen,
    });
    this.tab = 2;
    let cities = distinct.getData(distinct.getCode(choosen))
    this.resetAreas();
    this.setData({
      'cities': cities
    })
    this.initData()
  },
  chooseCity(event) {
    var choosen = event.currentTarget.dataset.city;
    // if (choosen == this.data.city) return;
    this.setData({
      'city': choosen,
    });
    this.tab = 2;
    let areas = distinct.getData(distinct.getCode1(choosen))
    this.resetAreas();
    this.setData({
      'areas': areas
    })
    this.initData()
  },
  chooseArea(event) {
    var choosen = event.currentTarget.dataset.area;
    // if (choosen == this.data.area) return;
    this.setData({
      'area': choosen,
    });
    this.initData()
  },
  resetProvince() {
    this.setData({
      'provinces': []
    })
  },
  resetCities() {
    this.setData({
      'provinces': []
    })
  },
  resetAreas() {
    this.setData({
      'areas': ''
    })
  },
  distinctCancel() {
    this.setData({
      'isPopupShow1': false
    })
    wx.showLoading({ title: '加载中' })
    this.getLocation();
  },
  menuClick1(event) {
    console.log('9090')
    this.setData({
      cities: '',
      areas: '',
      city: "",
      area: "",
      toViewA: '',
      toViewC: '',
      distinctStr: this.data.curProvince,
      province: '',
      toViewP: '',
      'isPopupShow1': true
    })
  },
  maskClick1(e) {
    this.setData({
      'isPopupShow1': false,
      distinctStr: this.data.curProvince + ' ' + this.data.curCity + ' ' + this.data.curArea
    });
  },
  distinctConfirm() {
    let that = this;
    this.setData({
      isPopupShow1: false,
      curProvince: that.data.province ? that.data.province : that.data.curProvince,
      curCity: that.data.city,
      curArea: that.data.area
    })
  },
  addMemberSubscription() {//添加订阅
    let params = {};
    params.stage = this.data.curStatus;
    params.cycle = this.data.curPushCycle;
    params.province = this.data.curProvince;
    params.city = this.data.curCity;
    params.area = this.data.curArea;
    params.startPrice = this.data.startPrice;
    params.endPrice = this.data.endPrice;
    params.phone = this.data.phone;
    params.name = this.data.name;
    params.userId = this.data.userId;
    console.log(params);
    httputil.post("/subscribe/add", params).then(res => {
      if (res.success) {
        wx.redirectTo({
          url: '../member-subscription/index',
        })
      } else {
        wx.showToast({
          title: res.message,
        })
      }
    })
  },
})