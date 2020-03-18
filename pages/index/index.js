const app = getApp()
const httputil = require('../../utils/httputil.js')
const distinct = require('../../template/drop-menu.js')
const DATA = require('../../template/data.js')
const config = require('../../config.js')
const qqmapsdk = config.service.QQMapAPI
const params = {
  searchType: '',
  sort: -1,
  type: -1,
  province: "",
  city: "",
  area: "",
  status: -1,
  time: -1,
  assetTitle: '',
  pageNo: 1,
  pageSize: 10
};

Page({
  data: {
    multiArray: [],
    multiArrayB: [],
    multiIndex: [0, 0, 0],
    multiIndexB: [0, 0, 0],
    searchTypeIndex: 0,
    //搜索类型
    searchTypeList: [
      {
        id: '1',
        text: '标的'
      },
      {
        id: '2',
        text: '法院'
      }
    ],
    sortList: DATA.sortList,
    // 轮播
    bannerUrls: [
      {
        url: 'https://www.71big.com/heqing/zhaojingwang/common/images/banner1.jpg',
        linkUrl: ''
      },
      {
        url: 'https://www.71big.com/heqing/zhaojingwang/common/images/banner1.jpg',
        linkUrl: ''
      },
      {
        url: 'https://www.71big.com/heqing/zhaojingwang/common/images/banner1.jpg',
        linkUrl: ''
      }
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    noData: false,
    lookAll: false,
    searchType: '',
    searchDisabled: true,
    tihuoWay: '标的',
    statusFilterShow: true,
    sortB: 0,
    searchList: [],
    ifSearchContent: false,
    searchValue: '',
    ifSearch: false,
    curScrollItem: 0,
    curScrollItemB: 0,
    scrolls: [
      {
        name: '推荐',
        status: '-1'
      },
      {
        name: '进行中',
        status: '12'
      },
      {
        name: '即将开始',
        status: '11'
      },
      {
        name: '看样预约中',
        status: '9'
      },
      {
        name: '成交',
        status: '13'
      },
      {
        name: '暂缓',
        status: '18'
      },
    ],
    ifUpgrade: true,
    auctionList: [],
    isPopupShow1: false,
    params: params,
    paramsB: params,
    provinces: '',
    cities: '',
    areas: '',
    province: "",
    city: "",
    area: "",
    toViewP: '', 
    toViewA: '', 
    toViewC:'',
    sortStr: '',
    sortStrB: '',
    typeStr: '',
    distinctStr: '',
    hasMore: false,
    hasMoreB: false,
    prefix: '',
    ifOne: false,
    showAllShow: false
  },
  onLoad: function (options) {
    console.log(options.assetId)
    if (options.assetId) {
      setTimeout(function () {
        wx.navigateTo({
          url: '../auction/detail?id=' + options.assetId,
        })
      }, 0)
    }
    wx.showLoading({ title: '加载中' })
    this.getUserLocation();
    // this.getLocal(39.92,116.46);
  },
  onReady: function () { 
    this.setData({
      ifOne: true
    })
    wx.clearStorage()
  },
  //轮播高度自适应——获取图片高度
  // imgHeight: function (e) {
  //   var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
  //   var imgh = e.detail.height;//图片高度
  //   var imgw = e.detail.width;//图片宽度
  //   var swiperH = winWid * imgh / imgw + "px"
  //   this.setData({
  //     Height: swiperH//设置高度
  //   })
  // },
  bindMultiPickerChange: function (event) {
    this.setData({
      multiArrayB: JSON.parse(JSON.stringify(this.data.multiArray)),
      multiIndexB: JSON.parse(JSON.stringify(this.data.multiIndex)),
      'params.province': this.data.multiArray[0][this.data.multiIndex[0]].name,
      'params.city': this.data.multiArray[1][this.data.multiIndex[1]].name,
      'params.area': this.data.multiArray[2][this.data.multiIndex[2]].name,
      'params.pageNo': 1,
      auctionList: []
    })
    this.getAuctionList();
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
  mapFindRoom() {
    wx.navigateTo({
      url: '../auction/map-find-room-detail',
    })
  },
  bindPickerSearchType(e){
    let index = e.detail.value;
    let name = this.data.searchTypeList[index].text;
    let id = this.data.searchTypeList[index].id;
    console.log(id)
    this.setData({
      tihuoWay: name,
      searchType: id,
      searchTypeIndex: index
    })
  },
  getUserLocation: function () {
    let vm = this;
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          vm.getAuctionList();
          vm.ifUpgradeDo();
          vm.initData();
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          vm.getLocation();
        }
        else {
          //调用wx.getLocation的API
          vm.getLocation();
        }
      }
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
        vm.getAuctionList();
        vm.ifUpgradeDo();
        vm.initData();
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
        console.log(res)
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
          province: province,
          'params.province': province,
          city: city,
          'params.city': city,
          'area': district,
          'params.area': district,
        },function(){
          vm.tab = 2;
          vm.getAuctionList();
          vm.ifUpgradeDo();
          vm.initData();
        })
        

      },
      fail: function (res) {
        vm.getAuctionList();
        vm.ifUpgradeDo();
        vm.initData();
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  },
  scrollItemTap(event) {
    let status = event.currentTarget.dataset.status;
    let index = event.currentTarget.dataset.id;
    this.setData({
      curScrollItem: index,
      'params.status': status
    })
    if(this.data.ifSearch) {
      this.setData({
        'searchList': [],
      })
    } else {
      this.setData({
        'auctionList': [],
      })
    }
    this.getAuctionList();
  },
  ifUpgradeDo() {
    httputil.get("asset/wxupgrade", {}).then(res => {
      if (res.success) {
        this.setData({
          ifUpgrade: res.data
        })
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
  getAuctionList(isRefresh = 1) {
    
    if (!isRefresh && !this.data.hasMore) return;
    if(isRefresh){
      this.setData({ 'params.pageNo': 1 })
    }
    let httpParams = {};
    httpParams = this.data.params;
    this.setData({
      searchDisabled: true
    })
    httputil.get("/asset/list", httpParams).then(res => {
      wx.stopPullDownRefresh()
      this.setData({
        searchDisabled: false
      })
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

          console.log('9999', isRefresh)
          if (this.data.ifOne && res.data.length === 0 && isRefresh){
            this.setData({
              showAllShow: true,
              ifOne: false
            })
          } else {
            this.setData({
              showAllShow: false,
              ifOne: false
            })
          }
          let data = [];
         
          if (this.data.ifSearch) {
            data = isRefresh ? res.data : this.data.searchList.concat(res.data)
            this.setData({
              searchList: data
            })
            
          } else {
            data = isRefresh ? res.data : this.data.auctionList.concat(res.data)
            this.setData({
              auctionList: data
            })
            if (res.data.length == 0) {
              this.setData({
                noData: true
              })
            } else {
              this.setData({
                noData: false
              })
            }
          }
          

          if (!isRefresh) {
            if (res.data.length == 10) {
              this.setData({
                'params.pageNo': ++this.data.params.pageNo
              })
            } else {
              this.setData({
                'hasMore': false
              })
            }
          } else {
            if (res.data.length < 10) {
              this.setData({
                'hasMore': false
              })
            } else {
              this.setData({
                'hasMore': true,
                'params.pageNo': ++this.data.params.pageNo
              })
            }
            wx.stopPullDownRefresh()
          }
        } else {
          this.setData({
            'hasMore': false
          })
        }
      } else {
        wx.showToast({
          title: res.message,
        })
      }
    })
  },

  onPullDownRefresh() {
    this.getAuctionList(1);
  },

  auctionProcess() {
    wx.navigateTo({
      url: '../auction/auction-process',
    })
  },

  onReachBottom() {
    this.getAuctionList(0);
  },

  initData() {
    this.setData({
      'prefix': config.service.ImageUrl
    })
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
    if(this.data.province) {
      this.setData({
        'provinces': distinct.getData(),
        'toViewP': distinct.getCode(this.data.province)
      });
    } else {
      this.setData({
        'provinces': distinct.getData(),
      });
    }

   
    this.setData({
      'sortStr': this.data.params.sort == -1 ? "" : DATA.sortList.find((element) => (element.id == this.data.params.sort)).text
    })
    

    this.setData({
      'typeStr': this.data.params.type == -1 ? "" : DATA.typeList.find((element) => (element.id == this.data.params.type)).text
    })
    this.setData({
      'distinctStr': this.data.province + this.data.city + this.data.area
    })
  },

  detail: function(event) {
    let assetId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../auction/detail?id=' + assetId,
    })
  },
  menuClick1(event) {
    this.setData({
      'isPopupShow1': true
    })
  },
  bindPickerSort(event){
    console.log(this.data.sortList[event.detail.value])
    let sort = this.data.sortList[event.detail.value].id;
    this.setData({
      'params.sort': sort,
      sortB: event.detail.value
    })
    console.log('sort click params' + JSON.stringify(this.data.params))
    this.initData()
    this.getAuctionList()
  },
  maskClick1(e) {
    this.setData({
      isPopupShow1: false
    });
  },
  navClick(event) {
    let type = event.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../auction/list?type=' + type,
    })
  },
  chooseProvince(event) {
    var choosen = event.currentTarget.dataset.province;
    // if (choosen == this.data.province) return;
    console.log(choosen)
    this.setData({
      'province': choosen,
      'params.province': choosen,
      'area': '',
      'params.area': '',
      'city': '',
      'params.city': '',

    });
    this.tab = 2;
    let cities = distinct.getData(distinct.getCode(choosen))
    this.resetAreas();
    this.setData({
      'cities': cities,
      'areas': '',
    })
    this.initData()
  },
  chooseCity(event) {
    var choosen = event.currentTarget.dataset.city;
    // if (choosen == this.data.city) return;
    this.setData({
      'city': choosen,
      'params.city': choosen,
      'area': '',
      'params.area': '',
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
      'params.area': choosen
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
  statusClick(event) {
    let status = event.currentTarget.dataset.status;
    this.setData({
      'params.status': status
    })
    
  },
  timeClick(event) {
    let time = event.currentTarget.dataset.time;
    this.setData({
      'params.time': time,
    })
  },
  distinctConfirm() {
    this.setData({
      'isPopupShow1': false,
      auctionList: [],
    })
    this.getAuctionList();
  },
  distinctCancel() {
    this.setData({
      'params.province': '',
      'params.city': '',
      'params.area': '',
      'province': '',
      'city': '',
      'area': '',
      'cities': '',
      'areas': '',
      'distinctStr': '',
      'isPopupShow1': false
    })
    this.getAuctionList();
  },
 
  searchValueCancel(e) {
    this.setData({
      searchValue: '',
    })
  },
  searchCancel(e) {
    this.setData({
      ifSearch: false,
      searchValue: '',
      searchList: [],
      ifSearchContent: false,
      sortStr: this.data.sortStrB,
      curScrollItem: this.data.curScrollItemB,
      hasMore: this.data.hasMoreB,
      params: this.data.paramsB,
      statusFilterShow: true,
      searchDisabled: false
    })
  },
  bindfocus(e) {
    let that = this;
    if (!this.data.ifSearch) {
      this.setData({
        sortStrB: this.data.sortStr,
        curScrollItemB: this.data.curScrollItem,
        paramsB: this.data.params,
        hasMoreB: this.data.hasMore
      },function(){
        that.setData({
          statusFilterShow: false,
          hasMore: false,
          params: params,
          ifSearch: true,
          sortStr: '',
          curScrollItem: 0,
          searchType: 1,
          tihuoWay: '标的'
        })
      })
    }
  }, 
  bindconfirm(e) {
    var that = this;
    var discountName = e.detail.value['search - input'] ? e.detail.value['search - input'] : e.detail.value;
    if (discountName == '') {
      return;
    }
    that.setData({
      hasMore: false,
      params: params,
      ifSearch: true,
      sortStr: '',
      curScrollItem: 0,
      'params.assetTitle': discountName,
      'params.searchType': this.data.searchType,
      'searchValue': discountName,
      'searchList': [],
      statusFilterShow: true,
    },function(){
      that.getAuctionList()
    })
  },
  searchInput(e) {
    let val = e.detail.value;
    console.log('e.detail.value',val)
    if (val !== '') {
      this.setData({
        'ifSearchContent': true
      })
    }
    this.setData({
      'searchValue': val,
    })
  },
  getUserInfo(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  totest() {
    wx.navigateTo({
      url: '../auction/rule',
    })
  },
  imgLoadError() {

  },
  memberSubscription(){
    wx.navigateTo({
      url: '../member-subscription/index',
    })
  },
  switchAll(){//切换到全国
    this.distinctCancel();
  }
})