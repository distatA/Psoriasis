import post from "../../../utils/request"
var WxParse = require('../../../utils/wxParse');
const util = require('../../../utils/util1');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        eventDetail: [],
        notes: ''

    },
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        let id = Number(options.id)
        console.log(id);
        post({
            url: '/hotActivity/detail',
            data: {
                id: id
            }
        }).then(res => {
            console.log(res);
            let {
                code,
                data
            } = res.data

            if (code === 200) {
                let notes = util.format(data.content)
                WxParse.wxParse('txtNew', 'html', notes, this, 5);
                this.setData({
                    eventDetail: data,
                    notes

                })
            }
        })
    },


})