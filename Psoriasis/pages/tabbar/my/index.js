const app = getApp()
import post from "../../../utils/request"
import {
    checkPermission
} from "../../../common/utils";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        active: 3,
        handleArr: [{
                name: '我的预约',
                icon: '../../../images/yuyue.png',
                url: '../../page/myBubscribe/index'
            },
            {
                name: '联系我们',
                icon: '../../../images/lianxi.png',
                url: '../../page/call/index'
            },
            {
                name: '账号验证',
                icon: '../../../images/bangding.png',
                url: '../../page/binding/index'
            },
        ],
        showLogin: false,
        userInfo: {},
        showLive: false
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
    },
    onShow() {
        this.setData({
            showLogin: false,
            userInfo: wx.getStorageSync('userInfo'),
        })
        const type = this.data.userInfo.type
        console.log(type, '用户类型');
        if (type === 2) {
            this.setData({
                showLive: true
            })
        }
    },
    toPage(e) {
        if (app.globalData.userId) {
            const url = e.currentTarget.dataset.url
            wx.navigateTo({
                url
            });
        } else {
            this.setData({
                showLogin: true,
            })
        }
    },
    login() {
        this.setData({
            showLogin: true
        })
    },
    onGotUserInfo(e) {
        var that = this;
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    wx.login({
                        success: function (res) {
                            console.log(e.detail.userInfo, '用户信息');
                            const {
                                code
                            } = res
                            post({
                                url: '/login',
                                data: {
                                    code
                                }
                            }).then(res => {
                                if (res.data.code === 200) {
                                    console.log(res.data.data);
                                    app.globalData.userInfo = res.data.data
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
                                        hasUserInfo: app.globalData.isLogin,
                                    })
                                    that.triggerEvent('loginSuccess', {
                                        isLogin: true
                                    })
                                } else {
                                    const {
                                        openid,
                                    } = res.data.data.result
                                    let userInfo = JSON.stringify(e.detail.userInfo)
                                    wx.navigateTo({
                                        url: `/pages/page/getUserPhone/index?userInfo=${userInfo}&openId=${openid}`,
                                    });

                                }
                            })
                        }
                    })

                } else {

                }
            },
            fail(res) {}
        })
    },
})