import post from "../../../utils/request"
var WxParse = require('../../../utils/wxParse');
const util = require('../../../utils/util1');
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getData()
    },

    getData() {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        let that = this
        post({
            url: '/freeClinic/service'
        }).then(res => {
            let {
                service_terms
            } = res.data.data
            service_terms = util.format(service_terms)
            WxParse.wxParse('txtNew', 'html', service_terms, that, 5);
            this.setData({
                service_terms
            })
        })
    }
})