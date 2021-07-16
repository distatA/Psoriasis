import post from "../../../utils/request"
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isDisabled: false,
        isPlaying: 0,
        state: 0,
        active: 2,
        showAd: false,
        page: 1, //页面页数
        limit: 5, //页面条数
        time: 3,
        eventDay: false, // 活动当天
        showLogin: false,

        phone: '',
        end_time: '',
        end_time_format: '',
        start_time: '',
        start_time_format: '',
        enroll_end_time: '',
        enroll_end_time_format: '',
        day: 0,
        free_clinic_open: [],
        free_clinic_rotation: [],
        cutDay: false, //是否截止预约
        is_appointment: false, //是否预约
        btn_text: "立即预约",
        isShowAd: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log(this.isToday('2020年9月30日'))
        wx.hideHomeButton()
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        this.interval()

    },

    onShow() {
        this.setData({
            showLogin: false,
        })
        this.getData()
    },

    goAd(e) {
        let current = e.currentTarget.dataset.url
        let BnannerUrl = this.data.free_clinic_rotation.map((v) => v.image);
        wx.previewImage({
            current, // 当前显示图片的http链接
            urls: BnannerUrl // 需要预览的图片http链接列表
        })
    },
    toBanner(e) {
        const id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: `../../page/bannerDetail/index?id=${id}`
        })
    },
    // 定时器
    interval() {
        let time = this.data.time
        let timer
        timer = setInterval(() => {
            time--
            this.setData({
                time
            })
            if (time <= 0) {
                this.setData({

                    time: 3,
                    showAd: false
                })
                clearInterval(timer)
            }
        }, 1000);
    },
    call(e) {
        // console.log(e);
        const phoneNumber = this.data.phone
        wx.makePhoneCall({
            phoneNumber
        })
    },
    toPage(e) {
        if (!app.globalData.userId) {
            this.isLogin()
        } else {
            let id = Number(e.currentTarget.dataset.id)
            const {
                notes
            } = this.data
            switch (id) {
                case 1:
                    wx.navigateTo({
                        url: `../../page/famousDoctors/index?id=${2}`,
                    });
                    break;
                case 2:
                    wx.navigateTo({
                        url: `../../page/exhibitionNotice/index?notes=${notes}`,
                    });
                    break;
            }
        }

    },
    loginSuccess() {
        this.getData()
    },
    // 是否登录 
    isLogin() {
        this.setData({
            showLogin: true
        })
    },
    //   跳转预约
    toSubscribe(e) {


        if (!app.globalData.userId) {
            this.setData({
                showLogin: true
            })
        } else {
            const {
                isPlaying,
                is_appointment,
                state,
                enroll_end_time,
                day
            } = this.data
            if (app.globalData.userId) {
                if (is_appointment) {
                    if (state == 0) { // 0就诊排队中
                        if (isPlaying == 0) {
                            this.tips("您已预约")
                        } else if (isPlaying == 1) {
                            wx.navigateTo({
                                url: '../../../pages/page/room/index',
                            })
                        } else if (isPlaying == 2) {
                            this.tips("义诊已结束")
                        }
                    } else if (state == 1 || state == 3) { //1正在就诊   3排号过期
                        wx.navigateTo({
                            url: '../../../pages/page/room/index',
                        })
                    } else if (state == 2) { // 2就诊已结束
                        this.tips("义诊已结束")
                    } else if (state == 4) { //4患者取消排队
                        this.tips("您已取消排队")
                    }
                } else {
                    if (day <= enroll_end_time) {
                        wx.navigateTo({
                            url: '../../../pages/page/subscribe/index',
                        })
                    } else {
                        this.tips("预约已结束")
                    }
                }
            } else {
                if (day <= enroll_end_time) {
                    this.setData({
                        btn_text: '立即预约'
                    })
                } else {
                    this.setData({
                        btn_text: '预约已结束'
                    })
                }
            }

        }
    },
    tips(tips) {
        wx.showModal({
            title: '温馨提示',
            content: tips,
            showCancel: false,
            success: function (res) {
                if (res.confirm) {} else {}
            }
        })
    },
    // 判断当天函数 
    isToday(str) {
        var d = new Date();
        var y = d.getFullYear(); // 年
        var m = d.getMonth() + 1; // 月份从0开始的
        m = m < 10 ? '0' + m : m
        var d = d.getDate(); //日
        d = d < 10 ? '0' + d : d
        return str == (y + '年' + m + '月' + d + '日');
    },
    // 获取数据
    getData() {
        post({
            url: '/freeClinic/intro',
            data: {
                user_id: app.globalData.userId,
                version:1
            }
        }).then(res => {
            // console.log(res);
            const {
                end_time, //义诊结束时间
                end_time_format,
                start_time, //义诊开始时间
                start_time_format,
                enroll_end_time, //预约截止时间
                enroll_end_time_format,
                phone,
                // begin_time,
                // over_time,
                is_appointment,
                notes,
                state
            } = res.data.data

            const {
                free_clinic_open,
                free_clinic_rotation,
            } = res.data.data.ad
            const day = parseInt(new Date().getTime() / 1000)
            const today = start_time_format.slice(0, 11)
            // console.log(today);
            const isShowAd = wx.getStorageSync('showAd')
            // console.log('是否谈过窗?', isShowAd);
            if (!isShowAd) {
                if (this.isToday(today)) {
                    wx.setStorageSync('showAd', true)
                    this.setData({
                        showAd: true,

                    })
                    this.interval()
                }
            }

            // 预约截止时间         义诊进行时间         义诊结束时间
            // 用户登录状态
            // 已预约状态      已预约                            进入义诊                       义诊已结束
            // 未预约状态      立即预约                 预约已结束       

            // 用户未登录状态
            //      立即预约   预约已结束    进入义诊



            // 立即预约
            // 已预约
            // 进入义诊
            // 义诊已结束
            //用户登录之后的 state  0就诊排队中 1正在就诊 2就诊已结束 3排号过期 4患者取消排队
            let isPlaying = 0;
            if (start_time < day && end_time > day) {
                isPlaying = 1; //义诊进行中
            } else if (start_time > day) {
                isPlaying = 0; //未到义诊开始时间
            } else if (end_time < day) {
                isPlaying = 2; //已经过了义诊时间
            }
            if (app.globalData.userId) {
                if (is_appointment) {
                    if (state == 0) { // 0就诊排队中
                        if (isPlaying == 0) {
                            this.setData({
                                btn_text: '已预约'
                            })
                        } else if (isPlaying == 1) {
                            this.setData({
                                btn_text: '进入义诊'
                            })
                        } else if (isPlaying == 2) {
                            this.setData({
                                btn_text: '义诊已结束',
                                isDisabled: true,
                            })
                        }
                    } else if (state == 1 || state == 3) { //1正在就诊   3排号过期
                        this.setData({
                            btn_text: '进入义诊'
                        })
                    } else if (state == 2) { // 2就诊已结束
                        this.setData({
                            btn_text: '义诊已结束',
                            isDisabled: true,
                        })
                    } else if (state == 4) { //4患者取消排队
                        this.setData({
                            btn_text: '已取消排队',
                            isDisabled: true,
                        })
                    }
                } else {
                    if (day <= enroll_end_time) {
                        this.setData({
                            btn_text: '立即预约'
                        })
                    } else {
                        this.setData({
                            btn_text: '预约已结束',
                            isDisabled: true,
                        })
                    }
                }

            } else {
                if (day <= enroll_end_time) {
                    this.setData({
                        btn_text: '立即预约'
                    })
                } else {
                    this.setData({
                        btn_text: '预约已结束',
                        isDisabled: true,
                    })
                }
            }
            this.setData({
                end_time,
                phone,
                start_time,
                free_clinic_open,
                free_clinic_rotation,
                is_appointment,
                notes,
                state,
                isPlaying,
                end_time,
                end_time_format,
                start_time,
                start_time_format,
                enroll_end_time,
                enroll_end_time_format,
                phone,
                is_appointment,
                notes,
                state,
                day
            })

        })
    },

})