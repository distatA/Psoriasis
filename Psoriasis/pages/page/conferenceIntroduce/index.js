import post from '../../../utils/request'
var WxParse = require('../../../utils/wxParse');
const util = require('../../../utils/util1');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nav: 0,
        brief: '',
        organization: '',
        speech: ''
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
    // 获取数据 
    getData() {
        let that = this
        post({
            url: '/intro/detail'
        }).then(res => {
            let {
                brief,
                organization,
                speech
            } = res.data.data
            brief = util.format(brief)
            organization = util.format(organization)
            speech = util.format(speech)
            WxParse.wxParse('jj', 'html', brief, that, 5);
            WxParse.wxParse('zz', 'html', organization, that, 5);
            WxParse.wxParse('zc', 'html', speech, that, 5);
            that.setData({
                brief,
                organization,
                speech
            })
        })
    },
    setNavTap: function (e) {
        let type = e.currentTarget.dataset.type;
        this.setData({
            nav: type,
        });
    },
})