// pages/auction/map-find-room.js
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
    multiIndex: [0, 0],
    multiIndexB: [0, 0],
    longitude: 0,
    latitude: 0,
    controls: [],
    markers: [],
    markersDetail: [],
    markersList: [],
    polyline: '',
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
    isPopupShow1: false,
    ifSearch: false,
    keyword: '',
    listDetailData: [],
    prefix: '',
    items: [],
    isDetail: false,
    assetId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getLocation();
    this.mapCtx = wx.createMapContext('myMap');
    // wx.getSystemInfo({
    //   success: function (res) {
    //     var version = res.SDKVersion;
    //     console.log(version)
    //   }
    // })
  },
  bindMultiPickerChange: function (event) {
    this.setData({
      multiArrayB: JSON.parse(JSON.stringify(this.data.multiArray)),
      multiIndexB: JSON.parse(JSON.stringify(this.data.multiIndex)),
      province: this.data.multiArray[0][this.data.multiIndex[0]].name,
      city: this.data.multiArray[1][this.data.multiIndex[1]].name,
      listDetailData: [],
      listData: [],
      ifSearch: false,
      area: '',
      items: [],
      markers: [],
      markersList: [],
      markersDetail: [],
      keyword: '',
      isDetail: false
    })
    this.getList();
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
        _multiIndex.splice(1, 1, 0)
        _multiIndex.splice(2, 1, 0)
        break
      case 1: //拖动第2列
        _multiIndex.splice(2, 1, 0)
        break
    }
    this.setData({
      multiIndex: _multiIndex,
      multiArray: _multiArray
    })
  },
  bindregionchange: function (e) {
    let that = this;
    if (e.causedBy == 'scale') {
      that.mapCtx.getScale({
        success: function (res) {
          let curScale = res.scale + 2;
          if (curScale > 13 && that.data.markersDetail.length > 0 && !that.data.isDetail) {
            that.setData({
              markers: that.data.markersDetail,
              // latitude: that.data.markersDetail[0].latitude,
              // longitude: that.data.markersDetail[0].longitude,
              isDetail: true,
            })
          }
          if (curScale < 13 && that.data.markersList.length > 0 && that.data.isDetail) {
            that.setData({
              markers: that.data.markersList,
              // latitude: that.data.markersList[0].latitude,
              // longitude: that.data.markersList[0].longitude,
              markersDetail: [],
              isDetail: false,
              ifSearch: false
            })
          }
        }
      })
    }
  },
  // 微信获得经纬度
  getLocation: function () {
    let vm = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(JSON.stringify(res))
        let latitude = res.latitude
        let longitude = res.longitude
        let speed = res.speed
        let accuracy = res.accuracy;
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
        const multiArray_0 = DATA.getDistincts(provinceCode, DATA.distincts);
        const multiArray_1 = DATA.getDistincts(cityCode, DATA.distincts);
        const multiIndex_0 = distinct.getCodeIndex(province, multiArray_0);
        const multiIndex_1 = distinct.getCodeIndex(city, multiArray_1);

        vm.setData({
          multiArray: [multiArray_0, multiArray_1],
          multiArrayB: [multiArray_0, multiArray_1],
          multiIndex: [multiIndex_0, multiIndex_1],
          multiIndexB: [multiIndex_0, multiIndex_1],
          distinctStr: city,
          province: province,
          city: city,
          latitude: latitude,
          longitude: longitude
        }, function () {
          console.log('latitude-longitude333333333', vm.data.latitude, vm.data.longitude)
          if (vm.data.isDetail) {
            vm.getListDetail();
          } else {
            vm.getList();
          }
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
  // getLocal(options) {
  // let province = options.province;
  // let city = options.city;
  // let that = this;
  // this.setData({
  //   province: province ? province : '',
  //   city: city ? city : '',
  // }, function () {
  //   if (that.data.isDetail) {
  //     that.getListDetail();
  //   } else {
  //     that.getList();
  //   }
  //   that.initData();
  // })
  // },
  geocoder(address) {
    console.log(address)
    let that = this;
    qqmapsdk.geocoder({
      //获取表单传入地址
      address: address, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      success: function (res) {//成功后的回调
        console.log(res)
        let resData = res.result;
        let latitude = resData.location.lat;
        let longitude = resData.location.lng;
        that.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
          latitude: latitude,
          longitude: longitude,
        });
        console.log('latitude-longitude44', that.data.latitude, that.data.longitude)
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },
  markertap(e) {
    console.log(e)
    console.log(this.data.isDetail)
    let that = this;
    if (that.data.isDetail) {
      let item = that.data.listDetailData[e.markerId];
      let latitudeB = item['latitude'];
      let longitudeB = item['longitude'];
      let sameDistrict = [];
      for (let i = 0; i < that.data.listDetailData.length; i++) {
        let val = that.data.listDetailData[i];
        if (val['latitude'] == latitudeB && val['longitude'] == longitudeB) {
          sameDistrict.push(val)
        }
      }
      that.setData({
        items: sameDistrict,
        ifSearch: true
      })
    } else {
      let area = that.data.listData[e.markerId]['area'];
      that.setData({
        area: area,
        isDetail: true,
      }, function () {
        that.getListDetail();
      })
    }
  },
  getList: function () {
    let that = this;
    httputil.get("/findHouse/area/count", { province: that.data.province, city: that.data.city }).then(res => {
      if (res.success) {
        if (res.data) {
          that.setData({
            listData: res.data
          })
          if (res.data.length > 0) {
            let listData = res.data;
            that.setData({
              latitude: listData[0].latitude,
              longitude: listData[0].longitude,
            })
            that.mapCtx.moveToLocation({
              latitude: listData[0].latitude,
              longitude: listData[0].longitude,
            })
            // that.geocoder(listData[0].province + listData[0].city + listData[0].area);
            let _markers = [];
            for (let i = 0; i < listData.length; i++) {
              _markers.push({
                id: i,
                latitude: listData[i].latitude,
                longitude: listData[i].longitude,
                iconPath: '../../image/map-icon-map.png',//图标路径
                width: 13,
                height: 14,
                callout: { //可根据需求是否展示经纬度
                  content: listData[i]['area'] + listData[i]['count'] + '套房',
                  fontSize: '14',
                  padding: true,
                  bgColor: "#02C3AF",
                  color: '#fff',
                  display: 'ALWAYS',
                  textAlign: 'center',
                  borderRadius: 10,
                  padding: 8,
                }

              })
            }
            that.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
              markers: _markers,
              markersList: _markers,
            });
            console.log('latitude-longitude55', that.data.latitude, that.data.longitude)
          } else {
            wx.showToast({
              title: '暂无房源',
              icon: 'none'
            })
            console.log('1111:::' + that.data.province + that.data.city)
            that.geocoder(that.data.province + that.data.city);
            that.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
              markers: [],
              markersList: []
            });
          }
        }
      }
    })

  },
  getListDetail: function () {
    let that = this;
    let params = {
      province: that.data.province,
      city: that.data.city,
      area: that.data.area,
      keyword: that.data.keyword
    }
    httputil.get("/findHouse/area/list", params).then(res => {
      if (res.success) {
        if (res.data) {
          let listDetailData = res.data;

          if (res.data.length > 0) {
            that.setData({
              latitude: listDetailData[0].latitude,
              longitude: listDetailData[0].longitude,
            })
            that.mapCtx.moveToLocation({
              latitude: listDetailData[0].latitude,
              longitude: listDetailData[0].longitude,
            })
            // that.geocoder(listDetailData[0].address);
            let _markers = [];
            for (let i = 0; i < listDetailData.length; i++) {
              let item = listDetailData[i];
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
              _markers.push({
                id: i,
                latitude: item.latitude,
                longitude: item.longitude,
                iconPath: '../../image/map-icon-map.png',//图标路径
                width: 13,
                height: 14,
                callout: { //可根据需求是否展示经纬度
                  content: item['address'],
                  fontSize: '14',
                  padding: true,
                  bgColor: "#02C3AF",
                  color: '#fff',
                  display: 'ALWAYS',
                  textAlign: 'center',
                  borderRadius: 10,
                  padding: 8,
                }

              })
            }
            that.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
              markers: _markers,
              markersDetail: _markers,
            });
            console.log('latitude-longitude11', that.data.latitude, that.data.longitude)
          } else {
            wx.showToast({
              title: '暂无房源',
              icon: 'none'
            })
            that.geocoder(that.data.province + that.data.city);
            that.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
              markers: [],
              markersDetail: []
            });
          }
          that.setData({
            listDetailData: listDetailData
          })
        }
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
  controltap(e) {
    console.log(e.controlId)
  },
  menuClick1(event) {
    this.setData({
      'isPopupShow1': true
    })
  },
  maskClick1(e) {
    this.setData({
      isPopupShow1: false
    });
  },
  distinctConfirm() {
    this.setData({
      'isPopupShow1': false,
      listDetailData: [],
      listData: [],
      ifSearch: false,
      items: [],
      area: '',
      markers: [],
      markersList: [],
      markersDetail: [],
      keyword: '',
      isDetail: false
    })
    this.getList();
  },
  distinctCancel() {
    this.setData({
      'province': '',
      'city': '',
      'area': '',
      'distinctStr': '',
      'isPopupShow1': false,
      ifSearch: false,
      isDetail: false,
      listData: [],
      listDetailData: [],
      markers: [],
      markersList: [],
      markersDetail: [],
    })
    console.log('pppp')
    this.getLocation();
  },
  initData() {
    this.setData({
      'prefix': config.service.ImageUrl
    })
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
      'distinctStr': this.data.province + this.data.city
    })
  },
  chooseProvince(event) {
    let choosen = event.currentTarget.dataset.province;
    // if (choosen == this.data.province) return;
    console.log(choosen)
    this.setData({
      'province': choosen,
    });
    this.tab = 2;
    let cities = distinct.getData(distinct.getCode(choosen))
    this.setData({
      'cities': cities
    })
    this.initData()
  },
  chooseCity(event) {
    let choosen = event.currentTarget.dataset.city;
    // if (choosen == this.data.city) return;
    this.setData({
      'city': choosen,
    });
    this.tab = 2;
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
  bindconfirm(e) {
    var that = this;
    var discountName = e.detail.value['search - input'] ? e.detail.value['search - input'] : e.detail.value;
    that.setData({
      keyword: discountName,
      ifSearch: false,
      area: '',
      markers: [],
      markersList: [],
      markersDetail: [],
      items: [],
    }, function () {
      if (discountName) {
        that.getListDetail();
        that.setData({
          isDetail: true,
        })
      } else if (discountName == '') {
        that.getList();
        that.setData({
          isDetail: false,
        })
      }
    })
  },
  detail: function (event) {
    let assetId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../auction/detail?id=' + assetId,
    })
  },

})