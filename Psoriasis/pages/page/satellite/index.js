import post from "../../../utils/request"
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nav: 0,
        venue_type: 1, // 1主会场，2分会场
        zhuPage: 1,
        fenPage: 1,
        limit: 10,
        zhuList: [],
        zhuCount: '',
        fenCount: '',
        fenList: [],
        toLive: false

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
    },
    onShow() {
        this.getStartArr(1, this.data.limit, this.data.venue_type)
        this.setData({
            toLive: false,
            zhuPage: 1,
            fenPage: 1,
        })
    },
    getData(page, limit, venue_type) {
        post({
            url: '/satellite/list',
            data: {
                page,
                limit,
                venue_type
            }
        }).then(res => {
            const {
                list,
                count
            } = res.data.data
            if (venue_type === 1) {
                const zhuList = list
                const zhuCount = count
                this.setData({
                    zhuCount,
                    zhuList: [...this.data.zhuList, ...zhuList]
                })
            } else if (venue_type === 2) {
                const {
                    list,
                    count
                } = res.data.data
                const fenCount = count
                const fenList = list
                this.setData({
                    fenCount,
                    fenList: [...this.data.fenList, ...fenList]
                })
            }
        })
    },
    getStartArr(page, limit, venue_type) {
        post({
            url: '/satellite/list',
            data: {
                page,
                limit,
                venue_type
            }
        }).then(res => {
            const {
                list,
                count
            } = res.data.data
            if (venue_type === 1) {
                const zhuList = list
                this.setData({
                    zhuList,
                    zhuCount:count
                })
            } else if (venue_type === 2) {
                const {
                    list,
                    count
                } = res.data.data
                const fenList = list
                this.setData({
                    fenList,
                    fenCount:count
                })
            }
        })
    },
    setNavTap: function (e) {
        let type = e.currentTarget.dataset.type;
        this.setData({
            venue_type: type,
            zhuPage:1,
            fenPage:1,
            zhuList:[],
            fenList:[]
        });
        switch (type) {
            case 1:
                this.getStartArr(this.data.zhuPage, this.data.limit, type)
                break;
            case 2:
                this.getStartArr(this.data.fenPage, this.data.limit, type)
                break;
        }
    },
    onReachBottom: function () {
        const {
            venue_type,
            zhuCount,
            fenList,
            zhuList,
            fenCount
        } = this.data
        console.log("触底",venue_type,zhuList.length,zhuCount)
        switch (venue_type) {
            case 1:
                if (zhuList.length < zhuCount) {
                    wx.showLoading({
                        title: '加载中',
                    })
                    let page = this.data.zhuPage + 1
                    
                    this.getData(page, 10, venue_type)
                    this.setData({
                        zhuPage: page
                    })
                    console.log("第几页",this.data.zhuPage)
                    wx.hideLoading()

                } else {
                    wx.showToast({
                        title: '已经到底了',
                        icon: 'none'
                    })
                }
                break;
            case 2:
                if (fenList.length < fenCount) {

                    wx.showLoading({
                        title: '加载中',
                    })
                    let page = this.data.fenPage + 1
                    this.getData(page, 10, venue_type)
                    this.setData({
                        fenPage: page
                    })
                    console.log("第几页",this.data.fenPage)
                    wx.hideLoading()

                } else {
                    wx.showToast({
                        title: '已经到底了',
                        icon: 'none'
                    })
                }
                break;
        }
    },
    toLive(e) {
        const {
            id
        } = e.currentTarget.dataset
        if (!this.data.toLive) {
            this.getLiveInfo(id)
            this.setData({
                toLive: true
            })
        }
    },
    // 获取直播详细信息
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
                url: `../../page/live/index?liveInfo=${liveInfo}`,
            });
        })
    },
})