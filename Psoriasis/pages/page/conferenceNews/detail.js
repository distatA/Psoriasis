import post from '../../../utils/request'
var WxParse = require('../../../utils/wxParse');
const util = require('../../../utils/util1');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: ''
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
  // escape2Html(str) {
  //   var arrEntities = {
  //     'lt': '<',
  //     'gt': '>',
  //     'nbsp': ' ',
  //     'amp': '&',
  //     'quot': '"'
  //   };
  //   return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
  //     return arrEntities[t];
  //   }).replace('<section', '<div').replace('<img', '<img style="max-width:100%;height:auto" ');
  // },
  getData(id) {
    let that = this
    post({
      url: '/article/detail',
      data: {
        id
      }
    }).then(res => {
      // console.log(res);
      let content = res.data.data.content
      content = util.format(content)
      WxParse.wxParse('txtNew', 'html', content, that, 5);
      that.setData({
        content
      })
    })
  }
})