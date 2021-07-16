import post from "../../../utils/request"
var WxParse = require('../../../utils/wxParse');
const util = require('../../../utils/util1');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    data: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    const {
      id
    } = options
    this.getData(Number(id))
  },
  getData(id) {
    post({
      url: '/notice/detail',
      data: {
        id
      }
    }).then(res => {
      const {
        data
      } = res.data
      const notes = util.format(data.content)
      WxParse.wxParse('txtNew', 'html', notes, this, 5);
      this.setData({
        data,
        notes
      })
    })
  }
})