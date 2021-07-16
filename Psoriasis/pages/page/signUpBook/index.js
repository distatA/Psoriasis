import post from "../../../utils/request"
const app = getApp()
var WxParse = require('../../../utils/wxParse');
const util = require('../../../utils/util1');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        meeting_enroll_notes: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        this.getData()
    },

    getData() {
        let that = this
        post({
            url: '/enroll/notes'
        }).then(res => {
            console.log(res);
            let {
                meeting_enroll_notes
            } = res.data.data
            meeting_enroll_notes = util.format(meeting_enroll_notes)
            WxParse.wxParse('txtNew', 'html', meeting_enroll_notes, that, 5);
            this.setData({
                meeting_enroll_notes
            })
        })
    }
})