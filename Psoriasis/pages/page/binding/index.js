import post from "../../../utils/request"
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        value: '',
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
    submit() {
        const value = this.data.value
        if (value.length === 10 && value) {
            post({
                url: '/user/bind',
                data: {
                    code: value,
                    user_id: app.globalData.userId
                }
            }).then(res => {
                wx.setStorageSync('userInfo', res.data.data)
                let userInfo = wx.getStorageSync('userInfo')
                if (res.data.code === 200) {
                    wx.showModal({
                        content: '绑定成功',
                        showCancel: false,
                        success: function () {
                            wx.redirectTo({
                                url: '../../tabbar/my/index',
                            })
                        }
                    })
                }
            
            })
        } else {
            wx.showToast({
                title: '验证邀请码格式不正确',
                icon: 'none',
                duration: 2000
            })
        }
    },

    onChange(event) {
        this.setData({
            value: event.detail
        })
    },
})