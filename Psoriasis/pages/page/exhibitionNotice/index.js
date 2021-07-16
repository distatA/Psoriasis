var WxParse = require('../../../utils/wxParse');
const util = require('../../../utils/util1');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        notes: ''
    },

    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
          })
        console.log(options.notes);
        let notes = util.format(options.notes)
        WxParse.wxParse('txtNew', 'html', notes, this, 5);
        this.setData({
            notes
        })
    },
})