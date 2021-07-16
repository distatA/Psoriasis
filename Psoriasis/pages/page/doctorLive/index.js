import post from "../../../utils/request"
const app = getApp()
var socketOpen = false
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showPPT: false, //展示ppt
        currentId: '', //pptid
        currentIndex: 0, //ppt索引
        showLiveEnd: false, //结束直播
        images: [],
        timeout: 10000,
        timeoutObj: null,
        refresher: false,
        page: 1, //评论页数
        pageLimit: 10,
        count: '', //评论总数
        serverTimeoutObj: null,
        toView: '', //评论聚焦
        choseImage: '', //当前选择的图片
        playURL: '', //地址流
        startLive: false, //开始直播
        liveInfo: {}, //直播详情
        handleClose: false, //是否手动关闭
        limit: 0, //重练次数
        reviewArr: [], //评论数组
        liveOpen: false, //手动关闭
        identity: '', //login的参数 0用户 1医生
        textLimit: 0,
        bugBox: false,
        // live_time: '', //直播时间
        // click_num: '' // 人数

    },
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        const userInfo = wx.getStorageSync('userInfo')
        //0是患者 1是医生
        const identity = userInfo.type === 1 ? 0 : 1
        try {
            var liveInfo = JSON.parse(options.liveInfo)
        } catch (error) {
            var liveInfo = wx.getStorageSync('liveInfo')
            this.setData({
                liveInfo
            })
        }
        this.setData({
            liveInfo,
            identity,
        })
        setTimeout(() => {
            if (this.data.liveInfo.ppt_url) {
                const images = liveInfo.ppt_url
                this.setData({
                    currentId: liveInfo.ppt_url[0].id,
                    choseImage: liveInfo.ppt_url[0].url,
                    images
                })
            }
        }, 1000)
        this.pushContext = wx.createLivePusherContext();
    },
    async onShow() {
        await this.setData({
            handleClose: false
        })
        await this.connectStart()
        await this.getPushURL()
        await this.getComment(this.data.page, this.data.pageLimit)
        var data = wx.getStorageSync('liveOpen')
        if (data.id === this.data.liveInfo.id && data.liveOpen) {
            this.startPlay()
            this.setData({
                startLive: true
            })
        }
    },
    // 推流
    startPlay: function () {
        var that = this;
        that.pushContext.start({
            success: () => {
                that.setData({
                    pushState: 'pushing'
                });
            },
            fail: () => {
                wx.showToast({
                    title: '推流开始失败'
                });
                that.setData({
                    pushState: 'stop'
                });
            },
        });
    },
    // scoket错误提示
    errorTips(tips) {
        wx.showModal({
            content: tips,
            showCancel: false,
            success: function () {
                wx.navigateBack({
                    complete: (res) => {},
                })
            }
        })
    },
    // 变化码
    statechange(e) {
    },
    // 发送id 
    sendId(userId) {
        let timeStamp = (new Date()).valueOf();
        let id = userId + "-" + timeStamp;
        return id
    },
    // 获取推流地址
    getPushURL() {
        var that = this;
        wx.showLoading({
            title: '连线中...',
        })
        post({
            url: '/live/getUrl',
            data: {
                live_type: 'push',
                room_id: that.data.liveInfo.id,
            },
        }).then(res => {
            wx.hideLoading();
            const {
                url
            } = res.data.data
            that.setData({
                playURL: url
            })
            wx.setKeepScreenOn({
                keepScreenOn: true
            });
            let obj = {
                seq: that.sendId(app.globalData.userId),
                cmd: 'login',
                data: {
                    channel: 2,
                    room_id: that.data.liveInfo.id,
                    identity: that.data.identity,
                    user_id: app.globalData.userId,
                    room_type: 0 //类型:0直播 1义诊
                }
            }
            wx.sendSocketMessage({
                data: JSON.stringify(obj)
            });
        })
    },
    // 记录点击的ppt索引 
    pptIndex(ppt_id, room_id) {
        post({
            url: '/live/switchPpt',
            data: {
                ppt_id,
                room_id
            }
        }).then(res => {
            // console.log(res);
        })
    },
    // 评论最底部
    scrollToBottom() {
        this.setData({
            toView: 'row_' + (this.data.reviewArr.length - 1)
        });
    },
    // 连接scoket 
    connectStart() {
        let that = this
        wx.connectSocket({
            url: 'wss://api-hospital.schoolpi.net/ws',
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log('Socket连接成功:', res);
                that.initEventHandle()
            },
            fail: function (res) {
                console.error('连接失败:', res);
            },
        })
    },
    // ppt弹窗
    showPPT(e) {
        // console.log(e);
        this.setData({
            showPPT: !this.data.showPPT
        })
    },
    // 上一张图片
    prevPPT(e) {
        let that = this
        let {
            images
        } = this.data
        let currentIndex = this.data.currentIndex - 1
        if (currentIndex < 0) {
            wx.showToast({
                title: '已经是第一张图片~',
                icon: 'none',
            })
            return
        } else {
            this.setData({
                choseImage: images[currentIndex].url,
                currentIndex
            })
            this.pptIndex(this.data.images[currentIndex].id, that.data.liveInfo.id)
            let obj = {
                seq: that.sendId(app.globalData.userId),
                cmd: 'cmd',
                data: {
                    cmd_type: 0,
                    data: that.data.images[that.data.currentIndex].id + ''
                }
            }
            wx.sendSocketMessage({
                data: JSON.stringify(obj),
            });
        }
    },
    // 下一张图片
    nextPPT(e) {
        let that = this
        let {
            images
        } = this.data
        let currentIndex = this.data.currentIndex + 1
        if (currentIndex >= images.length) {
            wx.showToast({
                title: '已经是最后一张~',
                icon: 'none',
            })
            return
        } else {
            this.setData({
                choseImage: images[currentIndex].url,
                currentIndex
            })
            this.pptIndex(this.data.images[currentIndex].id, that.data.liveInfo.id)
            let obj = {
                seq: that.sendId(app.globalData.userId),
                cmd: 'cmd',
                data: {
                    cmd_type: 0,
                    data: that.data.images[that.data.currentIndex].id + ''
                }
            }
          
            wx.sendSocketMessage({
                data: JSON.stringify(obj),
            });
        }
    },
    // 选择ppt图片 
    choseImg(e) {
        // console.log(e);
        let that = this
        const
            currentId = e.currentTarget.dataset.id,
            {
                url
            } = e.currentTarget.dataset,
            index = e.currentTarget.dataset.index
        this.setData({
            currentId,
            currentIndex: index,
            choseImage: url,
            showPPT: false,
        })
        that.pptIndex(that.data.images[index].id, that.data.liveInfo.id)
        let obj = {
            seq: that.sendId(app.globalData.userId),
            cmd: 'cmd',
            data: {
                cmd_type: 0,
                data: currentId + ''
            }
        }
        wx.sendSocketMessage({
            data: JSON.stringify(obj),
        });
    },
    // 转换分钟
    transferTime(second) {
        if (Number(second) && second > 0) {
            second = parseInt(second) // 舍去秒数以后的小数位
        } else {
            return '00:00'
        }

        // 计算时分秒
        var h, m, s;
        s = second % 60
        m = ((second - s) % 3600) / 60
        h = parseInt(second / 3600)

        // 优化输出
        function fn(num) {
            return num >= 10 ? num : '0' + num
        }
        return fn(m) + ':' + fn(s)
    },
    // 开始直播
    startLive() {
        let that = this
        if (that.data.liveInfo.status !== 3) {
            wx.showModal({
                title: '温馨提示',
                content: '是否确定开始直播吗',
                success(res) {
                    if (res.confirm) {
                        post({
                            url: '/live/beginLive',
                            data: {
                                live_room_id: that.data.liveInfo.id
                            }
                        }).then(res => {
                            if (res.data.code === 200) {
                                that.setData({
                                    startLive: true,
                                })
                                let data = {
                                    liveOpen: true,
                                    id: that.data.liveInfo.id
                                }
                                wx.setStorage({
                                    key: "liveOpen",
                                    data: data
                                })
                                socketOpen = true
                                let obj = {
                                    seq: that.sendId(app.globalData.userId),
                                    cmd: 'cmd',
                                    data: {
                                        cmd_type: 1,
                                        data: ''
                                    }
                                }
                                wx.sendSocketMessage({
                                    data: JSON.stringify(obj),
                                });
                                that.startPlay()
                            }
                        })
                    }
                }
            })
        } else {
            that.errorTips('直播已结束,无法再次开始')
        }
    },
    // 结束直播 
    endLive() {
        let that = this
        wx.showModal({
            title: '温馨提示',
            content: '是否确定关闭直播间',
            success(res) {
                if (res.confirm) {
                    post({
                        url: '/live/endLive',
                        data: {
                            live_room_id: that.data.liveInfo.id
                        }
                    }).then(res => {

                        if (res.data.code === 200) {
                            that.setData({
                                startLive: false,
                                showLiveEnd: true,
                            })
                            // that.getLiveDetail()
                       
                            that.setData({
                                click_num: res.data.data.click_num,
                                live_time: res.data.data.live_time
                            })
                            that.pushContext.stop();
                            let data = {
                                liveOpen: false,
                                id: that.data.liveInfo.id
                            }
                            wx.setStorage({
                                key: "liveOpen",
                                data: data
                            })
                            let obj = {
                                seq: that.sendId(app.globalData.userId),
                                cmd: 'cmd',
                                data: {
                                    cmd_type: 2,
                                    data: ''
                                }
                            }
                            wx.sendSocketMessage({
                                data: JSON.stringify(obj),
                            });
                        }
                    })
                }
            }
        })
    },
    // 初始化操作
    initEventHandle() {
        let that = this
        wx.onSocketMessage((res) => {
            var data = JSON.parse(res.data)
            if (data.cmd == 'login') {
                if (data.response.code !== 200) {
                    that.errorTips(data.response.codeMsg)
                } else {}
            } else if (data.cmd === 'msg') {
                if (data.response.code !== 200) {
                    that.errorTips(data.response.codeMsg)
                } else {
                    let {
                        reviewArr
                    } = that.data
                    reviewArr.push(data.response.data)
                    if (reviewArr.length > 200) {
                        reviewArr.slice(reviewArr.length - 200, reviewArr.length)
                    }
                    that.setData({
                        reviewArr
                    })
                    if (that.data.textLimit === 0) {
                        that.setData({
                            textLimit: 1,
                            bugBox: true
                        })
                        setTimeout(() => {
                            that.setData({
                                bugBox: false
                            })
                        }, 1000)
                    }
                    that.scrollToBottom()
                }
            } else if (data.cmd === 'heartbeat') {
                if (data.response.code !== 200) {
                    that.errorTips(data.response.codeMsg)
                } else {
                    that.reset()
                    that.start()
                }
            }
        })
        wx.onSocketOpen(() => {
            console.log('WebSocket连接打开')
            socketOpen = true
            let obj = {
                seq: that.sendId(app.globalData.userId),
                cmd: 'login',
                data: {
                    channel: 2,
                    room_id: that.data.liveInfo.id,
                    identity: that.data.identity,
                    user_id: app.globalData.userId,
                    room_type: 0 //类型:0直播 1义诊
                }
            }
            wx.sendSocketMessage({
                data: JSON.stringify(obj)
            });
            console.log(obj, 'login消息');
            that.reset()
            that.start()
        })

        wx.onSocketError(function (res) {
            console.log('WebSocket连接打开失败')
            socketOpen = false
            that.reconnect()
        })
        wx.onSocketClose(function (res) {
            socketOpen = false
            console.log('WebSocket 已关闭！', res)

            that.reconnect()
        })
    },
    // 重连
    reconnect() {
        var that = this
        if (that.data.handleClose) return
        if (that.lockReconnect) return
        that.lockReconnect = true
        clearTimeout(that.timer)
        if (that.data.limit < 10) {
            that.timer = setTimeout(() => {
                that.connectStart()
                that.lockReconnect = false
                console.log("重连次数:" + that.data.limit)
            }, 5000) //每隔5秒连接一次
            that.data.limit = that.data.limit + 1
        }
    },
    // 心跳机制 
    reset: function () {
        var that = this
        clearTimeout(that.data.timeoutObj)
        clearTimeout(that.data.serverTimeoutObj)
    },
    // 心跳机制 
    start: function () {
        var that = this
        if (socketOpen) {
            that.data.timeoutObj = setTimeout(() => {
                console.log("发送ping")
                wx.sendSocketMessage({
                    data: '{"seq":"' + that.sendId(app.globalData.userId) + '","cmd":"heartbeat","data":{}}',
                });
                that.data.serverTimeoutObj = setTimeout(() => {
                    wx.closeSocket()
                }, that.data.timeout)
            }, that.data.timeout)
        }
    },
    onHide: function () {
        if (socketOpen) {
            wx.closeSocket()
            this.reset()
            this.setData({
                limit: 0,
                timeout: 10000,
                timeoutObj: null,
                serverTimeoutObj: null,
                messageList: []
            })
        }
        this.setData({
            handleClose: true
        })
    },
    onUnload: function () {
        if (socketOpen) {
            console.log('出去了');
            let obj = {
                seq: this.sendId(app.globalData.userId),
                cmd: 'cmd',
                data: {
                    cmd_type: 3,
                    data: ''
                }
            }
            wx.sendSocketMessage({
                data: JSON.stringify(obj),
            });
            wx.closeSocket()
            this.reset()
            this.setData({
                limit: 0,
                timeout: 10000,
                timeoutObj: null,
                serverTimeoutObj: null,
                messageList: []
            })
        }
        this.setData({
            handleClose: true
        })
    },
    // 获取评论 
    getComment(page, limit) {
        post({
            url: '/live/msgList',
            data: {
                page,
                limit,
                live_room_id: this.data.liveInfo.id
            }
        }).then(res => {
            const {
                list,
                count
            } = res.data.data
            list.reverse()
            this.setData({
                reviewArr: list,
                count
            })
            this.scrollToBottom()
        })
    },
    // 评论下拉加载 
    bindrefresherrefresh(e) {
        if (this.data.reviewArr.length < this.data.count) {
            console.log(this.data.page);
            let page = this.data.page + 1
            this.setData({
                refresher: true
            })
            post({
                url: '/live/msgList',
                data: {
                    page,
                    limit: 10,
                    live_room_id: this.data.liveInfo.id
                }
            }).then(res => {
                const {
                    list,
                } = res.data.data
                const arr = [...this.data.reviewArr]
                list.reverse()
                arr.unshift(...list)
                this.setData({
                    reviewArr: arr,
                    refresher: false,
                    page
                })
            })
        } else {
            this.setData({
                refresher: false
            })
            wx.showToast({
                title: '没有更多评论~',
                icon: 'none',
                duration: 2000
            })
        }
    },
})