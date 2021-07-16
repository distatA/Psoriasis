import post from "../../../utils/request"
Page({
  data: {
    active: 0,
    page: 1,
    limit: 5,
    list: [],
    banner: [],
    count: '',
    notice: [],
    liveInfo: {},
    toLive: false

  },
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    this.getNotice()
     this.getData(this.data.page, this.data.limit)
  },
  onShow() {
    // this.setData({
    //   toLive: false
    // })
   

  },
  toBanner(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../../page/bannerDetail/index?id=${id}`
    })

  },
  goAd(e) {
    let current = e.currentTarget.dataset.url
    let BnannerUrl = this.data.banner.map((v) => v.image);
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls: BnannerUrl // 需要预览的图片http链接列表
    })
  },
  // 获取直播预告
  getNotice() {
    post({
      url: '/activity/liveNotice'
    }).then(res => {
      // console.log(res);
      const notice = res.data.data.list
      this.setData({
        notice
      })
    })
  },
  // 获取数据 
  getData(page, limit) {
    post({
      url: '/activity/date',
      data: {
        page,
        limit
      }
    }).then(res => {
      // console.log(res);
      const banner = res.data.data.ad.activity
      const {
        count,
        list
      } = res.data.data
      if (this.data.count >= this.data.list.length) {
        this.setData({
          list,
          banner,
          count
        })
      } else {
        this.setData({
          list: [...this.data.list, ...list],
          banner,
          count
        })
      }

    })
  },
  toLive(e) {
    const {
      id,day
    } = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `../../page/eventsList/index?day=${day}`,
    });
    // if (!this.data.toLive) {
    //   this.getLiveInfo(id)
    //   this.setData({
    //     toLive: true
    //   })
    // }
  },
  // 获取直播详细信息
  getLiveInfo(id) {
    post({
      url: '/live/detail',
      data: {
        id
      }
    }).then(res => {
      // console.log(id);
      const liveInfo = JSON.stringify(res.data.data)
      this.setData({
        liveInfo
      })
      wx.setStorageSync('liveInfo', res.data.data)
      // wx.navigateTo({
      //   url: `../../page/live/index?liveInfo=${liveInfo}`,
      // });
   
    })
  },
  // 下拉
  onReachBottom: function () {
    const {
      list,
      limit,
      count
    } = this.data
    if (list.length < count) {
      wx.showLoading({
        title: '加载中',
      })
      // console.log(this.data.page);
      let page = this.data.page + 1
      this.getData(page, limit)
      this.setData({
        page
      })
      wx.hideLoading()

    } else {
      wx.showToast({
        title: '已经到底了',
        icon: 'none'
      })
    }
  },
});