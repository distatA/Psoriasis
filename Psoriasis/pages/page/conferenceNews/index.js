import post from '../../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        limit: 10,
        type: 1,
        newsPage: 1, //最新动态的页数
        mediaPage: 1, //媒体报道页数
        newList: [], //最新动态的数组
        mediaList: [], //媒体报道的数组
        newListCount: '',
        mediaListCount: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        this.getStartArr(1, 10, this.data.type)
    },
    getData(page, limit, type) {
        post({
            url: '/article/list',
            data: {
                page,
                limit,
                type
            }
        }).then(res => {
            if (type === 1) {
                const newList = res.data.data.results
                const newListCount = res.data.data.count
                this.setData({
                    newListCount,
                    newList: [...this.data.newList, ...newList]
                })
            } else if (type === 2) {
                const mediaListCount = res.data.data.count
                const mediaList = res.data.data.results
                this.setData({
                    mediaListCount,
                    mediaList: [...this.data.mediaList, ...mediaList]
                })
            }
        })
    },
    getStartArr(page, limit, type) {
        post({
            url: '/article/list',
            data: {
                page,
                limit,
                type
            }
        }).then(res => {
            if (type === 1) {
                const newList = res.data.data.results
                this.setData({
                    newList
                })
            } else if (type === 2) {
                const mediaList = res.data.data.results
                this.setData({
                    mediaList
                })
            }
        })
    },
    // tab切换 
    setNavTap: function (e) {
        let type = e.currentTarget.dataset.type;
        this.setData({
            type,
        });
        switch (type) {
            case 1:
                this.getStartArr(this.data.newsPage, 10, type)
                break;
            case 2:
                this.getStartArr(this.data.mediaPage, 10, type)
                break;
        }
    },

    // 跳转详情页面
    goNews(e) {
        // console.log(e);
        const {
            id
        } = e.currentTarget.dataset

        wx.navigateTo({
            url: `./detail?id=${id}`
        });
    },
    onReachBottom: function () {
        const {
            type,
            newListCount,
            mediaListCount,
            newList,
            mediaList
        } = this.data
        switch (type) {
            case 1:
                if (newList.length < newListCount) {
                    // console.log('newList');
                    wx.showLoading({
                        title: '加载中',
                    })
                    let page = this.data.newsPage + 1
                    this.getData(page, 10, type)
                    this.setData({
                        newsPage: page
                    })
                    wx.hideLoading()

                } else {
                    wx.showToast({
                        title: '已经到底了',
                        icon: 'none'
                    })
                }
                break;
            case 2:
                if (mediaList.length < mediaListCount) {

                    wx.showLoading({
                        title: '加载中',
                    })
                    let page = this.data.mediaPage + 1
                    this.getData(page, 10, type)
                    this.setData({
                        mediaPage: page
                    })
                    wx.hideLoading()

                } else {
                    wx.showToast({
                        title: '已经到底了',
                        icon: 'none'
                    })
                }
                break;
        }
    }
})