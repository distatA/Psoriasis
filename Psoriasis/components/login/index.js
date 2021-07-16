const app = getApp()
import post from "../../utils/request"
Component({
    options: {
        multipleSlots: true
    },
    /**
     * 组件的属性列表
     */
    properties: {
        url: {
            type: String,
            value: '标题'
        },
        showLoginForm: {
            type: Boolean,
            value: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        showLoginForm: false,
        url: '/pages/page/getUserPhone/index'


    },
    ready: function () {
     
    },
    /**
     * 组件的方法列表
     */
    methods: {
        showLoginForm() {
            this.triggerEvent('fail', {
                isLogin: true
            })
            this.setData({
                showLoginForm: false,
            })
        },
        onGotUserInfo(e) {
            var that = this;
            wx.getSetting({
                success(res) {
                    if (res.authSetting['scope.userInfo']) {
                        wx.login({
                            success: function (res) {
                              
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
                                            hasUserInfo: app.globalData.isLogin
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

    }
})