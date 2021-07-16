const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const verifyUserId = str =>
  str && /^[a-zA-Z0-9_-]{3,50}$/.test(str)
const verifyRoomId = str =>
  str && /^[a-zA-Z0-9_-]{3,64}$/.test(str)

const checkPermission = () => {
  wx.getSetting({
    success(res) {
      // console.log("获取setting",res)


      if (!res.authSetting['scope.record']) {
        wx.authorize({
          scope: 'scope.record',
          success() {
            // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
          },
          fail: () => {
            wx.showModal({
              title: '缺少录音权限',
              content: '请前往设置打开小程序设置',
              confirmText: '前往设置',
              showCancel: false,
              success: (res) => {
                if (res.confirm) {
                  wx.openSetting({
                    success(res) {
                      console.log(res.authSetting)
                      checkPermission()
                    }
                  })
                }
              },
            })
          }
        })
      }

      if (!res.authSetting['scope.camera']) {
        wx.authorize({
          scope: 'scope.camera',
          success() {
            // 用户已经同意小程序使用摄像头功能，后续调用 wx.startRecord 接口不会弹窗询问
          },
          fail: () => {
            wx.showModal({
              title: '缺少摄像头权限',
              content: '请前往设置打开小程序设置',
              confirmText: '前往设置',
              showCancel: false,
              success: (res) => {
                if (res.confirm) {
                  wx.openSetting({
                    success(res) {
                      console.log(res.authSetting)
                      checkPermission()
                    }
                  })
                }
              },
            })
          }
        })
      }
      wx.getSystemInfo({
        success(res) {
          // console.log("设备",res)
          const cameraAuthorized = res.cameraAuthorized
          const microphoneAuthorized = res.microphoneAuthorized

          if (cameraAuthorized === false || microphoneAuthorized === false) {
            wx.showModal({
              title: '缺少权限',
              content: '请前往系统设置打开微信的摄像头和麦克风权限',
              confirmText: '知道了',
              showCancel: false,
              success: (res) => {
                if (res.confirm) {
                  checkPermission()
                }
              },
            })
          }
        }
      })
    }
  })
}

const sendId = (userId) => {
  let timeStamp = (new Date()).valueOf();
  let id = userId + "-" + timeStamp;
  return id
}
module.exports = {
  formatTime: formatTime,
  verifyUserId,
  verifyRoomId,
  checkPermission,
  sendId
}