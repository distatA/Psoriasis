import post from "../../utils/request"
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        active: {
            type: Number,
            default: 0
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        active: 0,
        results: [],
        isIphoneX: false
    },
    lifetimes: {
        // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
        attached: function () {
            let that = this
            post({
                url: '/menu/list',
                data: {
                    type: '1'

                }
            }).then(res => {
                const {
                    results
                } = res.data.data
                that.setData({
                    results
                })
            })
            const SystemInfo = wx.getSystemInfoSync();
            const phoneType = SystemInfo.system.toLowerCase().indexOf("ios") > -1
            const phoneNum = SystemInfo.model.charAt(SystemInfo.model.length - 1)
            if (phoneType) {
                if (phoneNum == 'X') {
                    this.setData({
                        isIphoneX: true
                    })
                }
            }
        },
    },
    /**
     * 组件的方法列表
     */

    methods: {
        changeTabBar(e) {
            const {
                id,
                url
            } = e.currentTarget.dataset
            this.setData({
                active: id
            })
            switch (id) {
                case 0:
                    wx.redirectTo({
                        url
                    })
                    break;
                case 1:
                    wx.redirectTo({
                        url
                    })
                    break
                case 2:
                    wx.redirectTo({
                        url
                    })
                    break
                case 3:
                    wx.redirectTo({
                        url
                    })
                    break
            }
        }
    }
})