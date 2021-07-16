import post from "../../../utils/request"
var WxParse = require('../../../utils/wxParse');
const util = require('../../../utils/util1');
const app = getApp()
let keepsTimer
//是否连接
var socketOpen = false
//普通直播  ppt直播  回放 ppt回放 普通转播 
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    nav: 1, //tab索引
    reviewArr: [],
    value: '', //输入框内容
    roomId: '',
    timeout: 10000,
    timeoutObj: null,
    serverTimeoutObj: null,
    toView: '', //评论聚焦
    playURL: '', // 地址流
    liveInfo: {}, //直播详细信息
    ppt: false, //是否直播ppt
    turnPPT: false, //是否转播ppt 
    video: false, //是否点播或回放
    handleClose: false, //是否手动关闭
    limit: 0, //连接次数
    page: 1, //评论页数
    pageLimit: 10,
    count: '', //评论总数
    videoUrl: '', //;视频地址
    signal_url: '', //转播的地址
    refresher: false,
    showWait: false, //直播时间已到,但未开播提示
    showCountTime: false, //开播剩余时间提示
    choseImage: '', //选中的ppt
    images: [], //ppt数组
    stopLive: false, //结束直播
    currenttime: 0, //结束时间
    durationtime: '', //当前时间
    pptPlayBack: false, //ppt回放
    lefttime: "00:00",
    righttime: "00:00",
    pause: true, //暂停
    jinduShow: false, // 进度条
    autoPlay: false,
    identity: '', //login的参数 0用户 1医生
    isTrue: false,
    timer: ''
  },
  // 直播组件 
  statechange(e) {
    console.log(e);
  },
  // 判断直播类型
  judgeLiveType() {
    let liveInfo = this.data.liveInfo
    let now = parseInt(new Date().getTime() / 1000)
    //status 1未开始 2直播中 3 直播结束
    //live_type 1直播, 2点播 3转播
    console.log(liveInfo.status, '直播状态');
    // 如果有回放地址
    if (liveInfo.playback_url) {
      const videoUrl = liveInfo.playback_url
      // 如果是普通ppt回放 
      if (liveInfo.ppt_playback && liveInfo.is_ppt_live === 1 && liveInfo.live_type === 1) {
        console.log('是ppt回放');
        this.videoContext = wx.createVideoContext('myVideo')
        this.setData({
          pptPlayBack: true,
          video: false,
          ppt: false,
          turnPPT: false,
          videoUrl
        })
        // 如果是转播ppt回放 
      } else if (liveInfo.is_ppt_live === 1 && liveInfo.live_type === 3) {
        this.setData({
          video: true,
          ppt: false,
          turnPPT: false,
          showCountTime: false,
          stopLive: false,
          videoUrl
        })
      } else if (!liveInfo.is_ppt_live) {
        console.log('普通回放');
        this.setData({
          video: true,
          ppt: false,
          turnPPT: false,
          showCountTime: false,
          stopLive: false,
          videoUrl
        })
      }
    }
    // 如果是ppt直播 并且正在直播
    if (liveInfo.is_ppt_live === 1 && liveInfo.status === 2) {
      // 是ppt转播并且有地址 
      if (liveInfo.live_type === 3 && liveInfo.signal_url.ppt && liveInfo.signal_url.relay) {
        // console.log('ppt转播');
        this.setData({
          turnPPT: true,
          turnPPTUrl: liveInfo.signal_url.ppt,
          turnPPTGeneral: liveInfo.signal_url.relay
        })
        let turnPPTUrlContext = wx.createLivePlayerContext('turnPPT', this);
        let turnPPTGeneralContext = wx.createLivePlayerContext('General', this);
        turnPPTUrlContext.play()
        turnPPTGeneralContext.play()
        // 是普通ppt直播 
      } else if (liveInfo.live_type === 1 && liveInfo.ppt_url) {
        // console.log('是ppt直播');
        this.setData({
          ppt: true,
          video: false,
          turnPPT: false
        })
        this.startPlay()
      }
      // 不是ppt直播
    } else if (liveInfo.is_ppt_live === 0 && liveInfo.status === 2 && liveInfo.live_type === 3 && liveInfo.signal_url.relay) {
   
      this.setData({
        playURL: liveInfo.signal_url.relay,
        showCountTime: false,
        showWait: false
      })
      if (!this.playContext) {
        let player = wx.createLivePlayerContext('player', this);
        player.play()
      } else {
        this.startPlay()
      }
    } else if (liveInfo.status === 1 && !this.data.isTrue) {
      if (now < liveInfo.start_time && liveInfo.live_type !== 2) {
        console.log('小于直播时间');
        this.setData({
          showCountTime: true
        })
      } else if (now > liveInfo.start_time && liveInfo.live_type !== 2) {
   
        this.setData({
          showCountTime: true,
          showWait: true
        })
      }
    }
    if (liveInfo.ppt_url) {
      
      let chosePPT = {}
      const id = liveInfo.ppt_index
      for (var i = 0; i < liveInfo.ppt_url.length; i++) {
        if (liveInfo.ppt_url[i].id == id) {
          chosePPT = liveInfo.ppt_url[i]
          this.setData({
            choseImage: chosePPT.url
          })
          break;
        }
      }
    }
    if (liveInfo.status === 3 && !liveInfo.playback_url) {
      this.setData({
        stopLive: true
      })
    }
  },
  // 轮询
  keepAsk() {
    // timer是定时器的对象
    let timer
    timer = setInterval(async () => {
      const res = await post({
        url: '/reply/status',
        data: {
          room_id: this.data.liveInfo.id
        }
      })
      //1.未开始2.开始 3.结束,
      const {
        status
      } = res.data.data
      console.log(status, '轮询直播状态');
      switch (status) {
        case 1:
          // await this.getLiveInfo(this.data.liveInfo.id)
          await this.judgeLiveType()
          break;
        case 2:
          await this.getLiveInfo(this.data.liveInfo.id)
          await this.judgeLiveType()
          this.setData({
            // timer: '',
            showCountTime: false,
            stopLive: false
          })
          break;
        case 3:
          await this.getLiveInfo(this.data.liveInfo.id)
          await this.judgeLiveType()
          clearInterval(this.data.timer)
          this.setData({
            // timer: '',
            turnPPT: false,
            stopLive: true,
          })
          break;
      }
    }, 3000);
    this.setData({
      timer
    })
      console.log("timer------------------",this.data.timer)
      console.log("timer1111111------------------",timer)

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
  // 视频变化时触发 
  videoUpdate(e) {
    let that = this
    let durationtime = this.transferTime(Math.floor(e.detail.duration)); //结束时间
    let currenttime = this.transferTime(Math.floor(e.detail.currentTime)) //当前时间
    this.setData({
      righttime: durationtime,
      lefttime: currenttime,
      currenttime: Math.floor(e.detail.currentTime),
      durationtime: Math.floor(e.detail.duration)
    })
    if (this.data.liveInfo.ppt_playback) {
      let pptList = this.data.liveInfo.ppt_url
      let pptBackList = this.data.liveInfo.ppt_playback
      let found = {}
      let pptid;
      for (let i = 0; i < pptBackList.length; i++) {
        if (pptBackList[i].timer <= Math.floor(e.detail.currentTime)) {
          found = pptBackList[i]
        }
      }
      if (found) {
        let pptid = found.pptid
        let ret = pptList.findIndex((value, index, arr) => {
          return value.id == pptid
        })
        if (ret > 0) {
          that.setData({
            choseImage: pptList[ret].url
          })
        }
      }
    }
    if (currenttime === durationtime) {
      wx.showToast({
        title: '直播回放已结束',
        icon: 'none',
      })
      this.setData({
        currenttime: 0,
        pause: true
      })
    }
  },
  // 发送id 
  sendId(userId) {
    let timeStamp = (new Date()).valueOf();
    let id = userId + "-" + timeStamp;
    return id
  },
  // 最底评论聚焦
  scrollToBottom() {
    this.setData({
      toView: 'row_' + (this.data.reviewArr.length - 1)
    });
  },
  // 切换tba栏
  setNavTap: function (e) {
    let type = e.currentTarget.dataset.type;
    this.setData({
      nav: type,
    });
    this.scrollToBottom()
  },
  // 开始推理
  startPlay: function () {
    console.log('拉流');
    var that = this;
    that.playContext.play({
      success: function () {
        console.log('play success');
      },
      fail: function (e) {
        console.log('play fail', e);
      },
      complete: function () {
        console.log('complete');
      }
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
  // 回放开始 
  play() {
    this.setData({
      autoplay: true,
      pause: false
    })
    setTimeout(() => {
      this.setData({
        jinduShow: false
      })
    }, 10000);
    this.videoContext.play()
  },
  // 回放暂停 
  pausePlay() {
    this.setData({
      pause: true
    })
    this.videoContext.pause()
  },
  // 秒数转时分秒
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
    if (h <= 0) {
      return fn(m) + ':' + fn(s)
    }
    return fn(h) + ':' + fn(m) + ':' + fn(s)
  },
  // 操作进度条
  changeSlider(e) {
    console.log("滑动slider", e.detail.value)
    let time = e.detail.value
    const timer = this.transferTime(time)

    this.setData({
      lefttime: timer,
    })
    this.videoContext.seek(time)
  },
  // 显示进度条
  showJindu() {
    this.setData({
      jinduShow: true
    })
    setTimeout(() => {
      this.setData({
        jinduShow: false
      })
    }, 10000);
  },
  // 获取直播详情
  getLiveInfo(id) {
    post({
      url: '/live/detail',
      data: {
        id
      }
    }).then(res => {
      const liveInfo = res.data.data
      this.setData({
        liveInfo
      })
    })
  },
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    })
    try {
      var liveInfo = JSON.parse(options.liveInfo)
    } catch (error) {
      var liveInfo = wx.getStorageSync('liveInfo')
      this.setData({
        liveInfo
      })
    }
    const userInfo = wx.getStorageSync('userInfo')
    const identity = userInfo.type === 1 ? 0 : 1
    app.globalData.userInfo = userInfo
    const righttime = this.transferTime(liveInfo.live_time)
    const notes = util.format(liveInfo.detail)
    WxParse.wxParse('txtNew', 'html', notes, this, 5);
    this.setData({
      liveInfo,
      userInfo,
      identity,
      cover: liveInfo.cover,
      images: liveInfo.ppt_url,
      righttime
    })
    this.playContext = wx.createLivePlayerContext('player', this);
    this.judgeLiveType()
    this.getComment(this.data.page, this.data.pageLimit)
    if (liveInfo.ppt_url && liveInfo.ppt_index === 0) {
      wx.setStorageSync('images', liveInfo.ppt_url)
      const images = wx.getStorageSync('images')
      if (images) {
        this.setData({
          currentId: images[0].id,
          choseImage: images[0].url,
          images
        })
      }
    }
  },
  onShow() {
    this.setData({
      handleClose: false,
      jinduShow: true
    })
    setTimeout(() => {
      this.setData({
        handleClose: false,
        jinduShow: false
      })
    }, 5000)
    this.connectStart()
    if (this.data.liveInfo.live_type !== 3) {
      this.getLiveUrl()
      // 如果是转播开始轮询
    } else if (this.data.liveInfo.live_type === 3) {
      this.keepAsk()

    }
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
  // 获取流地址 
  getLiveUrl() {
    wx.showLoading({
      title: '连线中...',
    })
    post({
      url: '/live/getUrl',
      data: {
        live_type: 'play',
        room_id: this.data.liveInfo.id,
      },
    }).then(res => {
      wx.hideLoading();
      const {
        url
      } = res.data.data
      this.setData({
        playURL: url
      })
      wx.setKeepScreenOn({
        keepScreenOn: true
      });
    })
  },
  // 发送消息
  doSend(e) {
    let that = this
    let content = e.detail.value
    const reviewArr = this.data.reviewArr
    if (content.trim() === '') {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.request({
        url: 'https://hospital.schoolpi.net/text/check',
        method: 'post',
        data: {
          text: content
        },
        success: function (res) {
          console.log("res", res)
          let {
            status
          } = res.data
          if (status == 500) {
            wx.showToast({
              title: '您所发的信息中含有敏感词',
              icon:'none'
            })
          } else if (status == 200) {
            let obj = {
              seq: that.sendId(app.globalData.userId),
              cmd: 'msg',
              data: {
                nickname: app.globalData.userInfo.nickname,
                avatar: app.globalData.userInfo.avatar,
                content
              }
            }
            console.log("发送弹幕消息", app, app.globalData.userInfo.nickName, app.globalData.userInfo.avatarUrl, content)
            wx.sendSocketMessage({
              data: JSON.stringify(obj)
            });
          }
        },
        fail: function (err) {
          console.log("err", err)
        }
      })

      this.setData({
        reviewArr,
        value: ''
      })
      this.scrollToBottom()
    }
  },
  // 初始化操作
  initEventHandle() {
    let that = this
    wx.onSocketMessage((res) => {
      // cmd_type 0是ppt 1开始周波 2 结束直播
      var data = JSON.parse(res.data)
      console.log("收到消息", data)

      if (data.cmd == 'login') {
        if (data.response.code !== 200) {
          that.errorTips(data.response.codeMsg)
        }
      } else if (data.cmd === 'msg') {
        if (data.response.code !== 200) {
          that.errorTips(data.response.codeMsg)
        } else {
          let {
            reviewArr
          } = that.data
          reviewArr.push(data.response.data)
          if (reviewArr.length > 20) {
            // console.log('减了');
            reviewArr.slice(reviewArr.length - 20, reviewArr.length)
          }
          that.setData({
            reviewArr
          })
          that.scrollToBottom()
        }
      } else if (data.cmd === 'cmd') {
        if (data.response.code !== 200) {
          that.errorTips(data.response.codeMsg)
        } else if (data.response.data.cmd_type === 0) {
          console.log(data.response.codeMsg);
          let chosePPT = {}
          const id = Number(data.response.data.data)
          for (var i = 0; i < that.data.images.length; i++) {
            if (that.data.images[i].id == id) {
              chosePPT = that.data.images[i]
              console.log(chosePPT);
              that.setData({
                choseImage: chosePPT.url
              })
              break;
            }
          }
        } else if (data.response.data.cmd_type === 1) {
          console.log('开始直播');
          this.setData({
            stopLive: false,
            showCountTime: false,
            isTrue: true
          })
          setTimeout(() => {
            console.log(data.response.data);
            console.log(this.data.liveInfo.status);
            this.getLiveInfo(this.data.liveInfo.id)
          }, 1000)
          setTimeout(() => {
            this.judgeLiveType()
          }, 2000)
        } else if (data.response.data.cmd_type === 2) {
          console.log('结束直播');
          setTimeout(() => {
            if (!this.data.videoUrl) {
              this.setData({
                stopLive: true,
                ppt: false,
                turnPPT: false,
                showCountTime: false
              })
              this.playContext.stop()
            }
          }, 1000)
        }
        // else if (data.response.data.cmd_type === 3) {
        //   setTimeout(() => {
        //     wx.showToast({
        //       title: '主播有事暂时离开~',
        //       icon: 'none',
        //     })
        //   }, 1000)
        // } else if (data.response.data.cmd_type === 4) {
        //   setTimeout(() => {
        //     wx.showToast({
        //       title: '主播回来啦~',
        //       icon: 'none',
        //     })
        //   }, 1000)
        // }
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
          channel: 2, //固定
          room_id: that.data.liveInfo.id,
          identity: that.data.identity, //0是患者 1是医生
          user_id: app.globalData.userId,
          room_type: 0 //类型:0直播 1义诊
        }
      }
      wx.sendSocketMessage({
        data: JSON.stringify(obj)
      });
      // console.log(obj, 'login消息');
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
    console.log("onHide timer",this.data.timer);

    clearInterval(this.data.timer);

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
      handleClose: true,
      timer: ''

    })
  },
  onUnload: function () {
    console.log("onUnload timer",this.data.timer);

    clearInterval(this.data.timer);
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
      handleClose: true,
      timer: ''
    })
  },
  // 评论下拉加载 
  bindrefresherrefresh(e) {
    if (this.data.reviewArr.length < this.data.count) {
      console.log(this.data.page);
      let page = this.data.page + 1
      // this.getComment(page, 10)
      // this.setData({
      //   page
      // })
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
        console.log(res);
        const {
          list,
        } = res.data.data
        const arr = [...this.data.reviewArr]
        list.reverse()
        arr.unshift(...list)
        // this.data.reviewArr.unshift([...this.data.reviewArr, ...list]),
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

  onShareAppMessage: function (res) {
   
    return {
      title: '第四届中国银屑病大会',
      path: 'pages/tabbar/index/index'
    }
  },

})