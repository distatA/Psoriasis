const {
    default: post
} = require("../../../utils/request")

const app = getApp()
// import post from "../../utils/request"
Page({
    data: {
        getPhone: false,
        getUserInfo: true,
        userInfo: {},
        openId: '',
        code: ''
    },
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        let userInfo = JSON.parse(options.userInfo)
        const {
            openId,
        } = options
        this.setData({
            userInfo,
            openId,
        })
    },
    getPhoneNumber(e) {
        let that = this
        const {
            iv,
            encryptedData
        } = e.detail
        let {
            openId,
        } = this.data

        const {
            nickName,
            gender,
            avatarUrl,
            city,
            province
        } = this.data.userInfo
        console.log(nickName, gender, avatarUrl, city, province);
        wx.login({
            success: function (res) {
                post({
                    url: '/user/reg',
                    data: {
                        openId,
                        nickName,
                        gender,
                        avatarUrl,
                        city,
                        province,
                        code: res.code,
                        iv,
                        encryptedData
                    }
                }).then(res => {
                    console.log(res);
                    if (res.data.code === 200) {
                        app.globalData.userInfo = res.data.data;
                        app.globalData.userId = res.data.data.user_id
                        app.globalData.isLogin = true;
                        wx.setStorage({
                            key: 'userInfo',
                            data: res.data.data,
                        })
                        wx.setStorage({
                            key: 'userId',
                            data: res.data.data.user_id,
                        })
                        that.setData({
                            showLoginForm: false,
                            userInfo: app.globalData.userInfo,
                            hasUserInfo: app.globalData.isLogin
                        })
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                })
            }
        })

    },
})