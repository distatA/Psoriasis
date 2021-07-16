import post from "../../../utils/request"
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nav: 0,
        active: 1,
        CompanyPage: 1,
        productPage: 1,
        eventsPage: 1,
        events: [],
        company: [],
        product: [],
        eventsCount: '',
        companyCount: '',
        productCount: ' '
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideHomeButton()
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        this.getCompany(this.data.CompanyPage, 5)
    },
    onShow(){
     
    },

    // 获取展商数据 
    getCompany(page, limit) {
        const that = this
        post({
            url: '/company/list',
            data: {
                page,
                limit
            }
        }).then(res => {
            const {
                code,
                data
            } = res.data
            if (code === 200) {
                const company = data.results
                if(that.data.company.length < data.count){
                    that.setData({
                        companyCount: data.count,
                        company: [...that.data.company, ...company]
                    })
                }
            }
        })
    },
    // 获取展品数据 
    getProduct(page, limit) {
        let _self = this;
        post({
            url: '/product/list',
            data: {
                page,
                limit
            }
        }).then(res => {
            const {
                code,
                data
            } = res.data
            if (code === 200) {
                const product = data.results
            
                if(_self.data.product.length < data.count){
                    _self.setData({
                        productCount: data.count,
                        product: [..._self.data.product, ...product]
                    })
                }
            }
        })
    },
    getEvents(page, limit) {
        let _self = this;

        post({
            url: '/hotActivity/list',
            data: {
                page,
                limit
            }
        }).then(res => {
            const {
                code,
                data
            } = res.data
            if (code === 200) {
                const events = data.results

                if(_self.data.events.length < data.count){
                    _self.setData({
                        eventsCount: data.count,
                        events: [..._self.data.events, ...events]
                    })
                }
            }
        })
    },
    // 展商详情页
    toPage(e) {
        const {
            id,
            type
        } = e.currentTarget.dataset
        switch (type) {
            case 1:
                console.log("之前的",this.data.company)
                this.data.company.map(item=>{
                    if(item.id==id){
                        item.sort+=1
                    }
                })
                this.setData({
                    company: this.data.company
                })
                console.log("之后的",this.data.company)
                let companyUrl = `../../../pages/page/companyDetail/index?id=${id}`
                wx.navigateTo({
                    url: companyUrl
                });
                break;

            case 2:
                this.data.product.map(item=>{
                    if(item.id==id){
                        item.sort+=1
                    }
                })
                this.setData({
                    product: this.data.product
                })
                let productUrl = `../../page/productDetail/index?id=${id}`
                wx.navigateTo({
                    url: productUrl
                });
                break;
            case 3:
                console.log("events",this.data.events)
                this.data.events.map(item=>{
                    if(item.id==id){
                        item.heat+=1
                    }
                })
                this.setData({
                    events: this.data.events
                })
                console.log("后events",this.data.events)
                let eventUrl = `../../page/eventDetail/index?id=${id}`
                wx.navigateTo({
                    url: eventUrl
                });
                break;

        }
    },
    // 商品详情页 
    toProduct(e) {
        const id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: ''
        })
    },
    // tab栏
    setNavTap: function (e) {
        let type = e.currentTarget.dataset.type;

        let {
            data
        } = this
        switch (type) {
            case 0:
                this.getCompany(this.data.CompanyPage, 5)
                break;
            case 1:
                this.getProduct(this.data.productPage, 5)
                break;
            case 2:
                this.getEvents(this.data.eventsPage, 5)
                break;
        }
        this.setData({
            nav: type,
        });
    },
    onReachBottom: function () {
        var data = this.data;
        switch (data.nav) {
            case 0:
                if (data.company.length < data.companyCount) {
                    wx.showLoading({
                        title: '加载中',
                    })
                    let page = this.data.CompanyPage + 1;
                    this.getCompany(page, 5)
                    this.setData({
                        CompanyPage: page
                    })
                    wx.hideLoading()


                } else {
                    wx.showToast({
                        title: '已经到底了',
                        icon: 'none'
                    })
                }
                break;
            case 1:
                if (data.product.length < data.productCount) {
                    wx.showLoading({
                        title: '加载中',
                    })
                    let page = this.data.productPage + 1;
                    this.getProduct(page, 5)
                    this.setData({
                        productPage: page
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
                if (data.events.length < data.eventsCount) {
                    wx.showLoading({
                        title: '加载中',
                    })
                    let page = this.data.eventsPage + 1;
                    this.getEvents(page, 5)
                    this.setData({
                        eventsPage: page
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
    },
})