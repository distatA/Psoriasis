import post from "../../../utils/request"
const app = getApp()
Page({
  data: {
    active: 0,
    leftPage: 1,
    leftLimit: 5,
    nav: 0,
    fenNav: 0,
    tabs: [],
    day: '',
    main_venue: [],
    branch_venue: [],
    ad: [],
    toLive: false
  },
  onLoad: function () {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  onShow() {

    this.getDate()
    this.getAd()
    this.setData({
      toLive: false
    })
  },
  toBanner(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../../page/bannerDetail/index?id=${id}`
    })

  },
  getAd() {
    post({
      url: '/ad/list',
      data: {
        position: [
          7
        ]
      }
    }).then(res => {
      const {
        ad
      } = res.data.data
      this.setData({
        ad
      })
    })
  },
  goAd(e) {
    let current = e.currentTarget.dataset.url
    let BnannerUrl = this.data.ad.live.map((v) => v.image);
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls: BnannerUrl // 需要预览的图片http链接列表
    })
  },
  // 跳转直播页面
  toLive(e) {
    const {
      id
    } = e.currentTarget.dataset
    post({
      url: '/live/setClickNum',
      data: {
        id:Number(id)
      }
    }).then(res => {})
    if (!this.data.toLive) {
      this.getLiveInfo(id)
      this.setData({
        toLive: true
      })
    }
  },
  // 获取直播详细信息
  getLiveInfo(id) {
    post({
      url: '/live/detail',
      data: {
        id
      }
    }).then(res => {
      const liveInfo = JSON.stringify(res.data.data)
      this.setData({
        liveInfo
      })
      wx.setStorageSync('liveInfo', res.data.data)
      wx.navigateTo({
        url: `../../page/live/index?liveInfo=${liveInfo}`,
      });
    })
  },
  // 获取日期tab
  getDate() {


    post({
      url: '/live/date',
      data:{
        version:1
      }
    }).then(res => {
      const tabs = res.data.data.result
      this.setData({
        tabs,
        day: tabs[this.data.nav].day,
      })
      const day = wx.getStorageSync('day');
      console.log(day);
      if (day) {
        this.getData(day)
      } else {
        this.getData(tabs[0].day)
      }
    })
  },
  getData(day) {
    post({
      url: '/live/list',
      data: {
        day,
        version:1
      }
    }).then(res => {
      const {
        main_venue,
        branch_venue,
      } = res.data.data
      this.setData({
        main_venue,
        branch_venue,
        day
      })
      wx.setStorageSync('day', day)
    })
  },
  // 日期tab 
  setNavTap: function (e) {
    let nav = e.currentTarget.dataset.index;
    let day = e.currentTarget.dataset.day;
    this.setData({
      nav
    });
    this.getData(day)
  },
  // 分会场tap 
  setNavFenTap: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      fenNav: index,
    });
  },
});