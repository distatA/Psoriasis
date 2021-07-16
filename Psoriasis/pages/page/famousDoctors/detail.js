import post from "../../../utils/request"
const app = getApp()
var WxParse = require('../../../utils/wxParse');
const util = require('../../../utils/util1');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        type: '',
        data: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        const id = Number(options.id)
        const type = Number(options.type)
        this.setData({
            id,
            type
        })
        console.log(this.data.id, this.data.type);
        this.getData(this.data.id, this.data.type)
    },
    getData(id, type) {
        let that = this
        post({
            url: '/doctor/detail',
            data: {
                id,
                type
            }
        }).then(res => {
            const {
                results
            } = res.data.data
            let notes = util.format(results.brief)
            WxParse.wxParse('txtNew', 'html', notes, that, 5);
            this.setData({
                data: results
            })
        })
    }
})