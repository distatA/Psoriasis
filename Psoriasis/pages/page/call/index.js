import post from "../../../utils/request"
Page({
    data: {
        data: []
    },
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        this.getData()
    },
    getData() {
        post({
            url: '/config'
        }).then(res => {
            this.setData({
                data: res.data.data
            })
        })
    }
})