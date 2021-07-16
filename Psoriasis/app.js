import * as QNRTC from './miniprogram_npm/pili-rtc-wxapp/index'
console.log(QNRTC);

App({
  onLaunch: function () {
    var that = this;
   
    this.globalData.userId = this.globalData.userInfo.user_id
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    wx.getSystemInfo({
      success: function (res) {
        that.globalData.statusBarHeight = res.statusBarHeight;
        that.globalData.windowHeight = res.windowHeight;
        that.globalData.pptHeight = res.screenHeight - res.statusBarHeight;
      },
    })

  },
  globalData: {
    isIpx: false,
    statusBarHeight: '',
    windowHeight: '',
    pptHeight: '',
    userInfo: wx.getStorageSync('userInfo'),
    userId: wx.getStorageSync('userId'), //用户id
    // 基地址
    baseUrl: 'https://api-hospital.schoolpi.net',
    type: '',
    token: '',
    roomToken: '',
    roomAppid: 'd8lk7l4ed',
    // userId: 28,//用户id
    doctorId: 27, //医生id
    roomUrl: "wss://rtmpgate.cloudvdn.com"
  },
})