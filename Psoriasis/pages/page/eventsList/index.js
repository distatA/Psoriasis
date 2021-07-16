import post from "../../../utils/request"
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        page: 1,
        count: 1,
        limit: 10,
        day:0,

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
            day: options.day
        })
        this.getData(1,this.data.limit,Number(this.data.day) )
    },
    onShow() {

    },
    getData(page, limit, day) {
        let list1 = this.data.list
        post({
            url: '/activity/list',
            data: {
                page,
                limit,
                day:Number(day)
            }
        }).then(res => {
            const {
                list,
                count
            } = res.data.data
            this.setData({
                list:list1.concat(list),
                count
            })
        })
    },


    onReachBottom: function () {
        const {
            day,
            count,
            limit,
            list
        } = this.data
        console.log("触底", day, count, list)

        if (list.length < count) {
            wx.showLoading({
                title: '加载中',
            })
            let page = this.data.page + 1
            this.getData(page, limit, day)
            this.setData({
                page: page
            })
            wx.hideLoading()

        } else {
            wx.showToast({
                title: '已经到底了',
                icon: 'none'
            })
        }

    },
    toLive(e) {
        const {
            id
        } = e.currentTarget.dataset
        let list = this.data.list;
        list.map(item=>{if(item.id==id){
            item.click_num+=1

        }})
        // if (!this.data.toLive) {
            this.getLiveInfo(id)
            this.setData({
                // toLive: true,
                list:list
            })
        // }
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