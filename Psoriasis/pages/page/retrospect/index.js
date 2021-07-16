import post from "../../../utils/request"
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        page: 1,
        limit: 10,
        retrospect: [],
        count: '',
        nav: 0,
        navArr: [],
        page: 1,
        results: [],
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
        // this.getData(this.data.page, 10)
        this.getNav()
    },
    goAd(e) {
        let current = e.currentTarget.dataset.url //当前点击的图片
        // let index = e.currentTarget.dataset.index //每一列的图片索引
        // let urls = this.data.retrospect[index].list.map((v, i) => {
        //     return v.image
        // })
        let urls = this.data.results.map((v, i) => {
            return v.image
        })
        wx.previewImage({
            current, // 当前显示图片的http链接
            urls // 需要预览的图片http链接列表
        })

    },
    getNav() {
        post({
            url: '/review/title',

        }).then(res => {
            this.setData({
                navArr: res.data.data.result,
                nav: res.data.data.result[0].id
            })
            this.getData(this.data.page, 10, res.data.data.result[0].id)
        })
    },
    getData(page, limit, id) {
        post({
            url: '/review/list',
            data: {
                page,
                limit,
                id
            }
        }).then(res => {
            const {
                results,
                count
            } = res.data.data
            this.setData({
                results,
                count,
            })
        })
    },
    setNavTap(e) {
        const {
            id
        } = e.currentTarget.dataset
        this.setData({
            nav: id,
            page: 1
        })
        this.getData(this.data.page, 10, id)
    },
    onReachBottom: function () {
        var data = this.data;
        if (data.results.length < data.count) {
            wx.showLoading({
                title: '加载中',
            })
            let page = this.data.page + 1;
            post({
                url: '/review/list',
                data: {
                    page,
                    limit: 10,
                    id: this.data.nav
                }
            }).then(res => {
                const {
                    results,
                    count
                } = res.data.data
                this.setData({
                    results: [...this.data.results, ...results],
                    count,
                })
            })
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