import post from '../../../utils/request'
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        user_id: 1,
        page: 1,
        limit: 10,
        list: [],
        count: ''
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        this.setData({
            user_id: app.globalData.userId
        })
        this.getData(this.data.page, 10, this.data.user_id)
    },
    getData(page, limit, user_id) {
        post({
            url: '/user/myLive',
            data: {
                page,
                limit,
                user_id
            }
        }).then(res => {
            const {
                list,
                count
            } = res.data.data
            this.setData({
                list: [...this.data.list, ...list],
                count
            })
        })
    },
    toLive(e) {
        const {
            id
        } = e.currentTarget.dataset
        this.getLiveInfo(id)
    },
    getLiveInfo(id) {
        post({
            url: '/live/detail',
            data: {
                id
            }
        }).then(res => {
            const liveInfo = JSON.stringify(res.data.data)
            this.setData({
                liveInfo
            })
            wx.setStorageSync('liveInfo', res.data.data)
            wx.navigateTo({
                url: `../../page/doctorLive/index?liveInfo=${liveInfo}`,
            });
        })
    },
    onReachBottom: function () {
        const {
            list,
            count,
            user_id
        } = this.data;
        if (list.length < count) {
            wx.showLoading({
                title: '加载中',
            })
            let page = this.data.page + 1;
            this.getData(page, 10, user_id)
            this.setData({
                page
            })
            wx.hideLoading()
        } else {
            wx.showToast({
                title: '已经到底了',
                icon: 'none'
            })
        }
    },

})