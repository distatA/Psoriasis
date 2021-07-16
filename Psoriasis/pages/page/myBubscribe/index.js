import post from "../../../utils/request"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    results: [],
    count: '',
    limit: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    this.getData(this.data.page, 10, app.globalData.userId)
  },
  getData(page, limit, user_id) {
    post({
      url: '/user/freeClinic',
      data: {
        page,
        limit,
        user_id
      }
    }).then(res => {
      const {
        results,
        count
      } = res.data.data
      this.setData({
        results: [...this.data.results, ...results],
        count
      })
    })
  },
  toRegister() {
    wx.navigateTo({
      url: '../../tabbar/exhibition/index',
    })
  },
  onReachBottom: function () {
    var data = this.data;
    if (data.results.length > data.count) {
      wx.showLoading({
        title: '加载中',
      })
      let page = this.data.page + 1;
      this.getCompany(page, 10, app.globalData.userId)
      wx.hideLoading()

    } else {
      wx.showToast({
        title: '已经到底了',
        icon: 'none'
      })
    }
  },
})