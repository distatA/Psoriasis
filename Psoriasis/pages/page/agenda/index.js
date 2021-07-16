import post from '../../../utils/request'
var WxParse = require('../../../utils/html2json.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: 0,
    tab: [],
    content: [],
    params: '', //获取tab的参数 
    htmlAry: [] //循环渲染富文本的数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    this.getTab()
  },
  // 获取数据
  getData(day) {
    let that = this
    post({
      url: '/agenda/detail',
      data: {
        day
      }
    }).then(res => {
      const content = res.data.data.results
      var htmlAry = [];
      const newContent = content.map((item, index) => {
        // let notes = item.content
        htmlAry[index] = WxParse.html2json(item.content, 'returnData');
        item.isShow = true
        //重点，就是这里。只要这么干就能直接获取到转化后的node格式数据；
        // console.log(htmlAry[index], 'index');
      })
      // console.log(htmlAry);
      this.setData({
        content,
        htmlAry
      })
    })
  },
  getTab() {
    let that = this
    post({
      url: '/agenda/date'
    }).then(res => {
      const tab = res.data.data.results
      const params = tab[0].day
      that.getData(params)
      this.setData({
        tab,
        params
      })
    })
  },
  // tab 栏切换 
  setNavTap: function (e) {
    let type = e.currentTarget.dataset.type;
    let day = e.currentTarget.dataset.day;
    this.setData({
      nav: type,
    });
    this.getData(day)
  },
  // 下拉
  dropDown(e) {
    const dropIndex = e.currentTarget.dataset.index
    let {
      content
    } = this.data
    content.forEach((item, index) => {
      if (index === dropIndex) {
        item.isShow = !item.isShow
      }
    });
    this.setData({
      content
    })
  }
})