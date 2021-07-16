import post from "../../../utils/request";
const app = getApp()
Page({
  data: {
    activeNames: ['1'],
    drapDown: false,
    showAd: false,
    showLogin: false,
    company: [], // 展商
    product: [], // 展品
    banner: [], //轮播
    open: [], //开屏
    rotation: [], //横幅
    focus: [], //焦点
    videoList: [],
    video: '',
    showMask: true,
    active: 0,
    menu: [],
    tishi: true,
    autoplay: true,
  },
  goWebview() {
    // wx.navigateTo({
    //   url: '/pages/page/moments/index',
    // })
    wx.navigateTo({
      url: '/pages/page/webview/index?url=https://as.alltuu.com/album/1023701023/?from=singlemessage&isappinstalled=0',
    })
  },
  onLoad() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    this.getData()
    this.getMenu()
    // 开屏广告
    this.setData({
      showAd: true
    })
  },
  switchTishi() {
    this.setData({
      tishi: false
    })
  },

  onShow() {
    const day = wx.getStorageSync('day') || {};
    if (day) {
      wx.removeStorageSync('day')
    }
    this.setData({
      showLogin: false
    })
  },
  // 轮播详情页
  toBanner(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../../page/bannerDetail/index?id=${id}`
    })
  },
  // 放大banner图片
  goAd(e) {
    let item = e.currentTarget.dataset.item;

    wx.navigateTo({
      url: `../../page/bannerDetail/index?id=${item.id}`
    })
  },
  // 获取菜单 
  getMenu() {
    post({
      url: '/menu/list',
      data: {
        type: '2'
      }
    }).then(res => {
      const menu = res.data.data.results
      this.setData({
        menu
      })
    })
  },
  // 获取数据 
  getData() {
    post({
      url: '/index'
    }).then(res => {
      const {
        company,
        product,
        focus,
        video,
        videoList
      } = res.data.data.results
      const {
        banner,
        open,
        rotation
      } = res.data.data.results.ad
      // videoList.push({url:'https://vd2.bdstatic.com/mda-kf1qszk2hum2ss5i/v1-cae/mda-kf1qszk2hum2ss5i.mp4?playlist=%5B%22hd%22%2C%22sc%22%5D&auth_key=1603107375-0-0-6c99ceec507c139544de59d1144b6ad1&bcevod_channel=searchbox_feed&pd=1&pt=3'})
      videoList.map(item => item.showMask = true)
      this.setData({
        company,
        product,
        banner,
        open,
        rotation,
        focus,
        video,
        videoList
      })
    })
  },
  // 是否登录 
  isLogin(url) {
    if (!app.globalData.userId) {
      this.setData({
        showLogin: true
      })
    } else {
      wx.navigateTo({
        url,
        fail: () => {
          wx.switchTab({
            url
          })
        }
      });
    }
  },
  //  焦点下拉
  anRequireContent(e) {
    let that = this
    that.setData({
      drapDown: !that.data.drapDown
    })
  },
  // 关闭弹窗
  closeAd() {
    this.setData({
      showAd: false
    })

  },

  toPage(e) {
    const url = e.currentTarget.dataset.url
    // this.setData({
    //   showLogin: true
    // })
    this.isLogin(url)
  },
  // 展品展商的跳转 
  goDetail(e) {
    const {
      type,
      id
    } = e.currentTarget.dataset
    switch (type) {
      case 1:
        const url = `../../page/companyDetail/index?id=${id}`
        wx.navigateTo({
          url
        });
        break;
      case 2:
        const ProductUrl = `../../page/productDetail/index?id=${id}`
        wx.navigateTo({
          url: ProductUrl
        });
        break;
      case 3:
        const importantUrl = `../../page/importantInfrom/index`
        wx.navigateTo({
          url: importantUrl
        });
        break;
    }
  },
  mask(e) {
    let {
      id
    } = e.currentTarget.dataset
    let list = this.data.videoList;
    list.map(item => {
      if (item.id == id) {
        item.showMask = !item.showMask
      }
    })
    this.setData({
      videoList: list,
      autoplay: false
    })
  },
  cahngeVideoIndex(e) {
    this.setData({
      autoplay: true
    })
  }
});