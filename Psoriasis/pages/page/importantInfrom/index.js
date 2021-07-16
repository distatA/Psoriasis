import post from "../../../utils/request"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    limit: 10,
    importantArr: [],
    count: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    this.getData(this.data.page, 10)
  },
  // 获取数据 
  getData(page, limit) {
    post({
      url: '/notice/list',
      data: {
        page,
        limit
      }
    }).then(res => {
      const {
        results
      } = res.data.data
      const {
        count
      } = res.data.data
      this.setData({
        importantArr: [...this.data.importantArr, ...results],
        count
      })
    })
  },
  // 跳转
  toPage(e) {
    const {
      id
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: `./detail?id=${id}`,
    });
  },
  onReachBottom: function () {
    if (this.data.importantArr.length < this.data.count) {
      wx.showLoading({
        title: '加载中',
      })
      let page = this.data.page + 1
      this.getData(page, 10)
      this.setData({
        page: page
      })
      wx.hideLoading()

    } else {
      wx.showToast({
        title: '已经到底了',
        icon: 'none'
      })
    }
  }
})