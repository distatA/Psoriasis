import post from "../../../utils/request"
var WxParse = require('../../../utils/wxParse');
const util = require('../../../utils/util1');
Page({
    data: {

    },
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        const id = Number(options.id)
        this.getData(id)
    },
    getData(id) {
        post({
            url: '/ad/detail',
            data: {
                id
            }
        }).then(res => {
            const notes = util.format(res.data.data.content)
            WxParse.wxParse('txtNew', 'html', notes, this, 5);
            this.setData({
                notes
            })
            wx.setNavigationBarTitle({
              title: res.data.data.title? res.data.data.title:'厂家详情',
            })
        })
    }
})