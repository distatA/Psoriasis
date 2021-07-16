import {
  RoomSession
} from 'pili-rtc-wxapp'
import {
  verifyRoomId,
  verifyUserId,
  sendId
} from '../../../utils/util';
import {
  getToken
} from '../../../common/api';
import post from "../../../utils/request"
import {
  checkPermission
} from "../../../common/utils";
const app = getApp()
let durationTimer;
let socketOpen = false

let mergeJobParam = {
  id: app.globalData.userId,
  publishUrl: '',
  w: 570,
  h: 1680,
  x: 0,
  y: 0,
}

Page({
  data: {
    isOver: false,
    showRTC: false, //开始视频义诊
    token: '',
    mic: true,
    volume: true,
    camera: true,
    beauty: 0,
    publishPath: "",
    subscribeList: [],
    debug: false,
    showFinish: false, //完成视频面试

    ctx: '',

    status: 0, //义诊状态 0已结束 1正在义诊、
    myNumber: 0, //我的义诊排号
    preNum: 0, //前面排队人数
    waitMinute: 0, // 等待时间
    isReorder: 0, // 过号重排 , 0就诊排队中 1正在就诊 2就诊已结束 3排号已过期 4患者取消排队

    //视频义诊
    duration: "00：00", //持续时间
    durationTime: 0,
    // 倒计时进入义诊
    countdown: 0, //倒计时时间
    showTimeOver: false, //是否进入倒计时

    // websocket
    limit: 0,
    timeout: 1000,
    timeoutObj: null,
    serverTimeoutObj: null,
    handleClose: false,

    // 加入房间失败重新刷新页面次数
    refreshCount: 0,

  },
  // 取消排队
  cancelWait() {
    wx.showModal({
      title: '提示',
      content: '取消排队后将无法进入义诊，确认取消排队？',
      success(res) {
        if (res.confirm) {
          var obj = {
            cmd: 'patient_cancel',
            seq: sendId(app.globalData.userId),
            data: {
              doctor_id: app.globalData.doctorId,
              user_id: app.globalData.userId,
            }
          }
          wx.sendSocketMessage({
            data: JSON.stringify(obj),
          });
          wx.switchTab({
            url: '../../tabbar/exhibition/index',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 过号重排
  reorder() {
    post({
      url: '/freeClinic/freeClinicAgain',
      data: {
        user_id: app.globalData.userId,
      }
    }).then(res => {
      if (res.data.code == 200) {
        wx.showToast({
          title: "重排成功",
          icon: "none"
        })
        this.setData({
          myNumber: res.data.data.queue_num
        })
        var obj = {
          cmd: 'patient_wait',
          seq: sendId(app.globalData.userId),
          data: {
            doctor_id: app.globalData.doctorId,
            user_id: app.globalData.userId,
          }
        }
        wx.sendSocketMessage({
          data: JSON.stringify(obj),
        });
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
        })
      }
    })
  },

  onLoad(query) {
    checkPermission()
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  setDurationTimer() {
    durationTimer = setInterval(() => {
      let time = this.data.durationTime + 1

      let str = this.getDurationStr(time)
      this.setData({
        durationTime: time,
        duration: str
      })
    }, 1000)
  },

  // 设置30s倒计时
  setTime() {
    let that = this
    let myTime = setInterval(function () {
      that.setData({
        countdown: that.data.countdown + 1
      })
      if (that.data.countdown == 0) {
        clearInterval(myTime)
        that.setData({
          showTimeOver: false,
          showRTC: true
        })
      }
    }, 1000)
  },
  startJoin() {
    const appid = app.globalData.roomAppid;
    const userid = Number(app.globalData.userId); //用户id
    const room = app.globalData.doctorId; //房间号 医生id
    post({
      url: '/live/getFreeClinicToken',
      data: {
        user_id: userid,
        doctor_id: room
      }
    }).then(res => {
      if (res.data.code != 200) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
        })
      }
      app.globalData.roomToken = res.data.data.token
      mergeJobParam.publishUrl = res.data.data.url
      this.setData({
        roomToken: res.data.data.token
      })
      this.pushContext = wx.createLivePusherContext()
      wx.showToast({
        title: '加入房间中',
        icon: 'loading',
        mask: true,
      })
      if (app.globalData.roomToken) {
        console.log("初始化房间token")
        this.initRoomWithToken(app.globalData.roomToken)
        return
      }
      if (!verifyUserId(userid)) {
        wx.switchTab({
          url: '../../tabbar/exhibition/index',
          success: () => {
            wx.hideToast()
            wx.showToast({
              title: '用户名最少 3 个字符，并且只能包含字母、数字或下划线',
              icon: 'none',
              duration: 2000
            })
          }
        })
        return;
      }
      if (!verifyRoomId(room)) {
        wx.switchTab({
          url: '../../tabbar/exhibition/index',
          success: () => {
            wx.hideToast()
            wx.showToast({
              title: '房间名最少 3 个字符，并且只能包含字母、数字或下划线',
              icon: 'none',
              duration: 2000
            })
          }
        })
        return;
      }
      this.appid = appid
      this.roomName = room
      this.userid = userid
      this.initRoom(appid, room, userid, app.globalData.roomUrl)

    })
  },
  getDurationStr(durationtime) {
    // durationtime  秒
    let h, m, s;
    h = Math.floor(durationtime / 60 / 60 % 24);
    m = Math.floor(durationtime / 60 % 60);
    s = Math.floor(durationtime % 60);
    h = h > 9 ? h : "0" + h;
    m = m > 9 ? m : "0" + m;
    s = s > 9 ? s : "0" + s;
    return m + ":" + s
  },
  onShow() {
    let that = this
    this.setData({
      handleClose: false
    })
    // 保持屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    });

    post({
      url: '/freeClinic/getQueueInfo',
      data: {
        version: 1,
        user_id: app.globalData.userId,
      }
    }).then(res => {
      if (res.data.code != 200) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
        })
      }
      console.log("res", res.data)
      app.globalData.doctorId = res.data.data.doctor_id
      this.setData({
        myNumber: res.data.data.queue_num
      })
      this.connectStart()

    })
    // onShow 中直接调用 play 无效
    wx.nextTick(() => {
      console.log('nextIck');
      for (const {
          key
        } of this.data.subscribeList) {
        ctx = wx.createLivePlayerContext(key)
        if (ctx) {
          ctx.play()
        }
      }
    })
  },
  toggleDebug() {
    this.setData({
      debug: !this.data.debug
    })
  },
  // 倒计时30秒 提示 
  time() {
    let time = this.data.time
    let timer = setInterval(() => {
      time--
      this.setData({
        time
      })
      if (time <= 0) {
        this.setData({
          timeOver: false,
          time: 30
        })
        clearInterval(timer)
      }
    }, 1000)
  },
  livePusherError(e) {
    if (Number(e.code) < 0) {
      wx.showToast({
        title: '发布失败'
      })
    }
    console.error('live-pusher error:', e.detail.code, e.detail.errMsg)
  },
  livePlayerError(e) {
    console.error('live-player error:', e.detail.code, e.detail.errMsg)
  },
  joinRoom(roomToken) {
    var that = this;
    console.log('this.session====', this.session)
    const starttime = Date.now().valueOf()

    return this.session.joinRoomWithToken(roomToken)
      .then(() => {
        console.log("加入房间成功")
        const endtime = Date.now().valueOf()
        const path = this.session.publish()
        console.log('推流地址pubpath: ' + path)
        const remoteTracks = (this.session.tracks || []).map(track => track.trackid)
        console.log("远程tracks------", remoteTracks)

        this.setData({
          publishPath: path,
        }, () => {
          this.startPush()
        })
        console.log("用户列表", this.session.users)

        this.session.users
          .filter(v => v.playerid !== this.session.userId)
          .forEach(v => {
            console.log('用户过滤的playerid', v.playerid)
            if (v.playerid == 'user__' + app.globalData.doctorId) {
              this.subscribe(v.playerid)
            }
          })
        that.createMergeJob()
        that.addMergeTracks()

      })
      .catch(err => {
        console.log("加入房间失败", err)
        if (this.data.refreshCount <= 3) {
          let count = this.data.refreshCount + 1
          this.setData({
            refreshCount: count
          })
          this.reconnect()
        } else {
          console.log('joinRoom  加入房间失败', err)
          wx.switchTab({
            url: '../../tabbar/exhibition/index',
            success: () => {
              wx.showToast({
                title: '加入房间失败',
                icon: 'none',
              })
            }
          })
        }

      })
  },
  // 创建合流
  createMergeJob() {
    console.log('创建合流', mergeJobParam)
    this.session.createMergeJob(mergeJobParam.id, mergeJobParam)

  },

  //添加合流
  addMergeTracks() {
    // 获取所有远程媒体流和本地媒体流
    console.log('添加合流', this.session)
    setTimeout(() => {
      console.log("本地流", this.session.localTracks)
      const allTracks = this.session.tracks.concat(this.session.localTracks)
      console.log("所有流所有流所有流所有流", allTracks)
      const addTracks = allTracks.map((track, idx) => ({
        trackid: track.trackid,
        w: 570,
        h: 1680,
        x: 0,
        y: 120 * idx
      }))
      console.log('所有加入合流的track', addTracks)
      this.session.addMergeTracks(addTracks, mergeJobParam.id)
      console.log('合流1111111', this.session)

    }, 1000)


  },
  // 删除合流
  removeMergeTracks() {
    // 获取所有远程媒体流和本地媒体流
    const allTracks = this.session.tracks.concat(this.session.localTracks)
    const removeTracks = allTracks.map(track => ({
      trackid: track.trackid
    }))
    console.log('所有删除合流的track', removeTracks)

    this.session.removeMergeTracks(removeTracks, mergeJobParam.id)
  },
  //停止合流
  stopMerge() {
    console.log('停止合流')
    this.session.stopMerge(mergeJobParam.id)
  },
  leaveRoom() {
    if (this.session) {
      return this.session.leaveRoom()
    }
    this.stopMerge()
  },
  subscribe(playerid) {
    console.log("订阅开始-------", playerid)
    console.log(this.session)
    const path = this.session.subscribe(playerid)
    console.log('订阅地址===========: ', playerid, path)
    console.log('订阅列表===========：', this.data.subscribeList)
    if (path) {
      const sub = this.data.subscribeList.filter(v => v.key !== playerid)
      sub.push({
        url: path,
        key: playerid,
      })
      console.log("订阅流========", sub)
      this.setData({
        subscribeList: sub,
      }, () => {
        let ctx = wx.createLivePlayerContext(playerid)
        if (ctx) {
          ctx.play()
        }
      })
    }
  },
  startPush() {
    console.log("开始推流", this.pushContext)

    this.pushContext.start({
      success: (res) => {
        console.log('push success成功', res)
        var obj = {
          cmd: 'patient_start',
          seq: sendId(app.globalData.userId),
          data: {
            doctor_id: app.globalData.doctorId,
            user_id: app.globalData.userId,
            order_sn: this.data.myNumber
          }
        }
        console.log("发送开始推流", obj)
        wx.sendSocketMessage({
          data: JSON.stringify(obj),
        });
        this.setDurationTimer()
      },
      fail: (err) => {
        console.log("推流失败", err)
        wx.showToast({
          title: '推流开始失败',
          icon: 'none',
        })
      },
      complete: (res) => {
        console.log("推流完成", res)
      }
    })
  },
  onHide() {
    if (this.pushContext) {
      this.leaveRoom()
    }
    wx.setKeepScreenOn({
      keepScreenOn: false
    });
    clearInterval(durationTimer)
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
  onUnload() {
    if (this.pushContext) {
      this.leaveRoom()
    }
    clearInterval(durationTimer)
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
  toggleMic() {
    this.setData({
      mic: !this.data.mic
    })
  },
  toggleVolume() {
    this.setData({
      volume: !this.data.volume
    })
  },
  toggleCamera() {
    this.setData({
      camera: !this.data.camera
    })
  },
  toggleBeauty() {
    this.setData({
      beauty: this.data.beauty ? 0 : 9
    })
  },
  onPhoneTab() {
    // leave room
    this.leaveRoom()
    wx.closeSocket({
      code: 1000,
    })
    wx.navigateBack({
      delta: 1
    })


  },
  switchCamera() {
    // console.log("切换摄像头")
    this.pushContext.switchCamera()

  },

  initRoom(appid, room, userid, url) {
    let session
    if (url) {
      session = new RoomSession({
        server: url,
      })
    } else {
      session = new RoomSession()
    }
    this.session = session
    this.handleEvent(session)

    return getToken(appid, room, userid)
      .then(token => {
        app.globalData.roomUrl = url
        console.log("token====", token)
        return this.joinRoom(token)
      })
  },
  initRoomWithToken(roomToken, url) {
    let session
    console.log("url=====", url, roomToken)
    // let session
    if (url) {
      session = new RoomSession({
        server: url,
      })
    } else {
      session = new RoomSession()
    }
    this.session = session
    this.handleEvent(session)


    console.log("房间有几人", this.session.users)

    if (this.session.users.length >= 2) {
      wx.showToast({
        title: '房间已有两人',
        icon: "none"
      })
      return
    } else {

      return this.joinRoom(roomToken)

    }


  },
  handleEvent(session) {
    console.log("handleEvent======================================================")
    session.on('track-add', (tracks) => {
      console.log('监听新增用户', tracks)
      this.addMergeTracks()
      const set = {}
      for (const track of tracks) {
        console.log('单个track的playerid', track.playerid)
        // 每个 playerid 只订阅一次
        console.log("set对象里面只订阅一次", set)
        if (!set[track.playerid] && (track.playerid == "user__" + app.globalData.doctorId || track.playerid == 'user__' + app.globalData.userId)) {
          set[track.playerid] = true
          this.subscribe(track.playerid)
        }
      }
    })
    session.on('track-remove', (tracks) => {
      // console.log('track-remove', tracks)
      this.removeMergeTracks()
      this.setData({
        subscribeList: this.data.subscribeList
          .filter(v => !tracks.reduce((accumulator, currentValue) =>
            accumulator && v.url.includes(currentValue.trackid), true)),
      })
    })
    session.on('user-leave', (user) => {
      // console.log('user-leave', user)
      this.setData({
        subscribeList: this.data.subscribeList.filter(v => v.key !== user.playerid),
      })

    })
    session.on('user-join', (user) => {
      console.log('user-join', user)
    })
    session.on('disconnect', (res) => {
      let title = '已离开义诊房间'

      if (res.code === 10006) {
        title = '医生已挂断';
      }
      wx.switchTab({
        url: '../../tabbar/exhibition/index',
        success: () => {
          wx.showToast({
            title,
            icon: 'none',
          })
        },
      })
    })
    session.on('error', (res) => {
      console.log('session error', res)
      this.reconnect()
    })
    session.on('reconnecting', () => {
      console.log('尝试重连中...')
      wx.showToast({
        title: '尝试重连中...',
        icon: 'loading',
        mask: true,
      })
    })
    session.on('reconnected', () => {
      this.startPush()
      for (const track of this.data.subscribeList) {
        const ctx = wx.createLivePlayerContext(track.key)
        if (ctx) {
          ctx.play()
        }
      }
      wx.hideToast()
    })
  },
  reconnect() {
    console.log('尝试重连中...')
    wx.showToast({
      title: '尝试重连中...',
      icon: 'loading',
      mask: true,
    })
    this.session && this.session.leaveRoom()
    this.setData({
      publishPath: '',
      subscribeList: [],
    })
    this.pushContext.stop()
    this.reconnectTimer = setTimeout(() => {
      if (app.globalData.roomToken) {
        this.initRoomWithToken(app.globalData.roomToken, app.globalData.roomUrl).then(() => {
          wx.hideToast()
        }).catch(e => {
          console.log(`reconnect failed: ${e}`)
          return this.reconnect()
        })
      } else if (this.appid && this.roomName && this.userid) {
        this.initRoom(this.appid, this.roomName, this.userid, app.globalData.roomUrl).then(() => {
          wx.hideToast()
        }).catch(e => {
          console.log(`reconnect failed: ${e}`)
          return this.reconnect()
        })
      } else {
        wx.switchTab({
          url: '../../tabbar/exhibition/index',
          success: () => {
            wx.showToast({
              title: '加入房间失败',
              icon: 'none',
            })
          }
        })
      }
    }, 1000)
  },


  //连接websocket  监听完成

  //初始化websocket

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
  initEventHandle() {
    let that = this
    wx.onSocketOpen(() => {
      console.log('WebSocket连接打开')
      socketOpen = true
      var obj = {
        cmd: 'login',
        seq: sendId(app.globalData.userId),
        data: {
          channel: 2, //1 pc 2 小程序
          room_id: app.globalData.doctorId,
          room_type: 1, //0直播 1义诊
          identity: 1, //1患者 2医生
          user_id: app.globalData.userId,
        }
      }
      console.log("发送登录", obj)
      wx.sendSocketMessage({
        data: JSON.stringify(obj),
      });
      that.reset()
      that.start()
    })
    wx.onSocketMessage((res) => {
      //收到消息
      var data = JSON.parse(res.data)

      if (data.cmd != "heartbeat") {
        console.log(data);
      }

      if (data.cmd == 'login') {
        // 弹幕
        if (data.response.code != 200) {
          wx.showModal({
            content: data.response.codeMsg,
            showCancel: false,
          })
        } else {
          var obj = {
            cmd: 'patient_wait',
            seq: sendId(app.globalData.userId),
            data: {
              doctor_id: app.globalData.doctorId,
              user_id: app.globalData.userId,
            }
          }
          wx.sendSocketMessage({
            data: JSON.stringify(obj),
          });
        }
      } else if (data.cmd === 'heartbeat') {
        that.reset()
        that.start()
      } else if (data.cmd === 'patient_wait') {

        // room_status  0义诊未开始 1义诊正在进行中 2义诊已结束
        // user_status 0就诊排队中 1正在就诊 2就诊已结束 3排号已过期 4患者取消排队
        if (data.response.data['room_status'] || data.response.data['room_status'] == 0) {
          console.log("有room_status")

          this.setData({
            preNum: data.response.data.preNumber,
            waitMinute: (data.response.data.preNumber + 1) * 5,
            status: data.response.data.room_status,
            isReorder: data.response.data.user_status
          })
          console.log("等待时间", this.data.waitMinute)
          if (data.response.data.user_status == 0) {
            // wx.showToast({
            //   title: '就诊排队中',
            //   icon: "none"
            // })
            console.log("就诊排队中");
          } else if (data.response.data.user_status == 1) {
            that.setData({
              showTimeOver: false,
              showRTC: true
            })
            this.startJoin()
          } else if (data.response.data.user_status == 2) {
            wx.showToast({
              title: '就诊已结束',
              icon: "none"
            })
          } else if (data.response.data.user_status == 3) {
            // wx.showToast({
            //   title: '排号已过期',
            //   icon: "none"
            // })
            console.log("排号已过期")
          }
        } else {
          this.setData({
            preNum: data.response.data.number,
            waitMinute: (data.response.data.number + 1) * 5,
          })
        }


      } else if (data.cmd === 'fc_cmd') {
        let myTime;
        console.log("fc_cmd======", data.response.data)
        let cmd_type = data.response.data.cmd_type
        // 1患者等候命令(患者端) 2患者开始接诊命令(患者端) 3患者挂断命令(患者端) 4患者成功开始接诊(医生端)
        if (cmd_type == 1) {
          console.log("患者接到即将开始进入义诊命令")
          // 患者接到即将开始进入义诊命令
          that.setData({
            showTimeOver: true,
            showRTC: false
          })

          myTime = setInterval(function () {
            let count = that.data.countdown
            that.setData({
              countdown: count + 1
            })
          }, 1000)
        } else if (cmd_type == 2) {
          // 患者正式会诊
          clearInterval(myTime)
          that.setData({
            showTimeOver: false,
            showRTC: true
          })
          this.startJoin()

        } else if (cmd_type == 3) {
          // 被挂断
          console.log("收到被挂断信息")
          wx.showToast({
            title: '您已被挂断',
            icon: "none",
          })
          that.leaveRoom()
          that.setData({
            showTimeOver: false,
            showRTC: false,
            isOver: true,
            isReorder: 0,
          })
        } else if (cmd_type == 5) {
          // 获取房间状态
          this.setData({
            status: data.response.data.room_status,
          })
        } else if (cmd_type === 6) {
          wx.showToast({
            title: '医生临时关闭了义诊 ~',
            icon: "none"
          })
        }
      }
    })

    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败')
      socketOpen = false
      that.reconnectWebsocket()
    })
    wx.onSocketClose(function (res) {
      socketOpen = false
      console.log('WebSocket 已关闭！', res)
      that.reconnectWebsocket()
    })
  },

  reconnectWebsocket() {
    var that = this
    if (that.data.handleClose) return
    if (that.lockReconnect) return
    that.lockReconnect = true
    clearTimeout(that.timer)
    if (that.data.limit < 100) {
      that.timer = setTimeout(() => {
        that.connectStart()
        that.lockReconnect = false
        console.log("重连次数:" + that.data.limit)
      }, 5000) //每隔5秒连接一次
      that.data.limit = that.data.limit + 1
    }
  },
  reset: function () {
    var that = this
    clearTimeout(that.data.timeoutObj)
    clearTimeout(that.data.serverTimeoutObj)
  },
  start: function () {
    var that = this
    if (socketOpen) {
      that.data.timeoutObj = setTimeout(() => {
        wx.sendSocketMessage({
          data: '{"seq":"' + sendId(app.globalData.userId) + '","cmd":"heartbeat","data":{}}',
        });
        that.data.serverTimeoutObj = setTimeout(() => {
          wx.closeSocket()
        }, that.data.timeout)
      }, that.data.timeout)
    }
  },
})