const app = getApp()
import post from "../../../utils/request"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        name: '', //姓名
        phone: '', // 手机号
        code: '', // 验证码 
        email: '', // 邮箱
        sex: 1, // 性别
        showSex: false, // 性别弹窗 
        showJoin: false, // 是否参加 
        join: 1, //参加
        isjoin: true,
        hospital: '', //
        region: ['安徽省', '合肥市', '庐江县'], // 地区 
        regionCode: ["340000", "340100", "340124"],
        sexArr: [{
                name: '男',
            },
            {
                name: '女',
            },

        ],
        joinArr: [{
                name: '是',
            },
            {
                name: '否',
            },

        ],
        checked: false, //阅读协议
        disabled: false, //禁用
        codeText: '获取验证码',
        currentTime: '',
        textArea: '', //备注
        multiArray: [],
        multiIndex: [0, 0, 0],
        userInfo: '', //用户信息
        showGetPhone: false,
        notPhone: false,
        compatibility: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        const userInfo = wx.getStorageSync('userInfo')
        this.getArea()
        setTimeout(() => {
            if (userInfo.phone) {
                const phone = userInfo.phone + ''
                this.setData({
                    phone,
                    userInfo
                })
            } else {
                this.setData({
                    notPhone: true
                })
            }
        }, 2000)
        // 兼容手机高度
        const SystemInfo = wx.getSystemInfoSync();
        console.log(SystemInfo.screenHeight);
        if (SystemInfo.screenHeight < 700) {
            this.setData({
                compatibility: true
            })
        }
    },
    // 点击性别弹窗 
    clickSex() {
        this.setData({
            showSex: true
        });
    },
    // 点击参加弹窗 
    clickJoin() {
        this.setData({
            showJoin: true
        });
    },

    // 参加选择完毕 
    // 性别选择完毕  
    onClose() {
        this.setData({
            showSex: false,
            showJoin: false
        });
    },
    // 性别取消 
    cancel() {
        this.setData({
            showSex: false,
            showJoin: false
        });
    },
    // 参加选择 
    onSelectJoin(e) {
        console.log(e.detail);
        if (e.detail.name === '是') {
            this.setData({
                join: 1,
                isjoin: true
            })
            console.log(this.data.join);

        } else if (e.detail.name === '否') {
            this.setData({
                join: 0,
                isjoin: true
            })
            console.log(this.data.join);
        }

    },
    // 性别选择 
    onSelectSex(e) {
        console.log(e.detail);
        if (e.detail.name === '男') {
            this.setData({
                sex: 1
            })

        } else {

            this.setData({
                sex: 2
            })
        }
    },
    // 地区选择
    bindRegionChange(e) {
        const areaArr = e.detail.value
        const regionCode = e.detail.code
        this.setData({
            region: areaArr,
            regionCode
        })
    },
    // 阅读协议状态 
    onChange(e) {
        this.setData({
            checked: e.detail,
        });
    },
    // 点击发送验证
    sendMsg() {
        this.waitCode();
        this.setData({
            disabled: true
        })
    },
    // 验证码定时器 
    waitCode() {
        var interval
        var currentTime = 60
        interval = setInterval(() => {
            currentTime--;
            this.setData({
                codeText: currentTime + '秒后重新发送'
            })
            if (currentTime <= 0) {
                clearInterval(interval)
                this.setData({
                    codeText: '获取验证码',
                    currentTime: 60,
                    disabled: false
                })
            }
        }, 1000)
    },
    // 手机输入框修改内容
    changePhone(e) {
        let _this = this
        const phone = e.detail
        _this.setData({
            phone
        })
    },
    // 姓名输入框
    changeName(e) {
        const name = e.detail
        this.setData({
            name
        })
    },
    // 验证码输入框
    changeCode(e) {
        const code = e.detail
        this.setData({
            code
        })
    },
    // 邮箱输入框
    changeEmail(e) {
        const email = e.detail
        this.setData({
            email
        })
    },
    changeHospital(e) {
        const hospital = e.detail
        this.setData({
            hospital
        })
    },
    // 备注输入框
    changeTextArea(e) {
        const textArea = e.detail.value
        this.setData({
            textArea
        })

    },
    // 获取地区信息 
    getArea() {
        post({
            url: '/area'
        }).then(res => {
            console.log(res.data.data.result)
            let data = res.data.data.result
            this.setData({
                provinces: data,
                multiArray: [data, data[0].child, data[0].child[0].child]
            })
        })
    },
    bindMultiPickerColumnChange(e) {
        // 注意处理直辖市自治区（nodeType =2  -- citys(null) areas(Array)）与其他省份(nodeType=1 -- citys(Array) areas(Array))
        console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
        var data = {
            multiArray: this.data.multiArray,
            multiIndex: this.data.multiIndex
        };
        //更新滑动的第几列e.detail.column的数组下标值e.detail.value
        data.multiIndex[e.detail.column] = e.detail.value;
        //如果更新的是第一列“省”，第二列“市”和第三列“区”的数组下标置为0
        if (e.detail.column == 0) {
            data.multiIndex = [e.detail.value, 0, 0];
        } else if (e.detail.column == 1) {
            //如果更新的是第二列“市”，第一列“省”的下标不变，第三列“区”的数组下标置为0
            data.multiIndex = [data.multiIndex[0], e.detail.value, 0];
        } else if (e.detail.column == 2) {
            //如果更新的是第三列“区”，第一列“省”和第二列“市”的值均不变。
            data.multiIndex = [data.multiIndex[0], data.multiIndex[1], e.detail.value];
        }
        var temp = this.data.provinces;
        data.multiArray[0] = temp;
        if ((temp[data.multiIndex[0]].child) && (temp[data.multiIndex[0]].child).length > 0) {
            //如果第二列“市”的个数大于0,通过multiIndex变更multiArray[1]的值
            data.multiArray[1] = temp[data.multiIndex[0]].child || [];
            var areaArr = (temp[data.multiIndex[0]].child[data.multiIndex[1]]) && (temp[data.multiIndex[0]].child[data.multiIndex[1]]).child || [];
            //如果第三列“区”的个数大于0,通过multiIndex变更multiArray[2]的值；否则赋值为空数组
            data.multiArray[2] = areaArr.length > 0 ? areaArr : [];
        } else {
            //如果第二列“市”的个数不大于0，那么第二列“市”和第三列“区”都赋值为空数组
            //直辖市citys = null，直接赋值areas
            data.multiArray[1] = [];
            data.multiArray[2] = temp[data.multiIndex[0]].child || [];
        }

        this.setData({
            multiArray: data.multiArray,
            multiIndex: data.multiIndex,
        });
    },
    bindMultiPickerChange: function (e) {
        let {
            multiArray,
            multiIndex
        } = this.data;
        let provinceName,
            cityName,
            districtName,
            provinceId,
            cityId,
            districtId;
        provinceName = multiArray[0][multiIndex[0]].name;
        cityName = multiArray[1].length > 0 ? multiArray[1][multiIndex[1]].name : '';
        districtName = multiArray[2].length > 0 ? multiArray[2][multiIndex[2]].name : '';
        provinceId = multiArray[0][multiIndex[0]].id;
        cityId = multiArray[1].length > 0 ? multiArray[1][multiIndex[1]].id : '';
        districtId = multiArray[2].length > 0 ? multiArray[2][multiIndex[2]].id : '';
        this.setData({
            provinceName,
            cityName,
            districtName,
            provinceId,
            cityId,
            districtId,
            region: provinceName + cityName + districtName,
        })
    },
    submit() {
        const {
            name,
            phone,
            sex,
            email,
            join,
            textArea,
            checked,
            isjoin,
            region,
            hospital,
            cityId,
            districtId,
        } = this.data
        console.log(name.length,
            phone.length,
            sex,
            email,
            region,
            join,
            textArea,
            app.globalData.userInfo
        );
        if (name && name.length <= 4 && phone && sex && region && isjoin && checked && app.globalData.userId) {
            console.log('完整');
            post({
                url: '/enroll/write',
                data: {
                    name,
                    phone,
                    gender: sex,
                    address: region,
                    is_join: join,
                    email,
                    remark: textArea,
                    user_id: app.globalData.userId,
                    hospital,
                }
            }).then(res => {
                console.log(res);
                if (res.data.code === 200) {
                    wx.showModal({
                        title: '温馨提示',
                        content: '恭喜你已报名成功',
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                wx.navigateBack({
                                    delta: 1
                                })
                            }
                        }
                    })
                } else {
                    wx.showToast({
                        title: res.msg,
                        icon: 'none',
                    })
                }
            })
        } else if (!app.globalData.userId) {
            wx.showToast({
                title: '用户未登陆',
                icon: 'none',
            })
            wx.switchTab({
                url: '../../tabbar/my/index'
            })
        } else if (!name || name.length > 4) {
            wx.showToast({
                title: '请填写正确姓名',
                icon: 'none',
            })
        } else if (!phone) {
            wx.showToast({
                title: '请填写正确的手机号',
                icon: 'none',
            })
        } else if (!sex) {
            wx.showToast({
                title: '请填写性别',
                icon: 'none',
            })
        } else if (!region) {
            wx.showToast({
                title: '请选择地区',
                icon: 'none',
            })
        } else if (!checked) {
            wx.showToast({
                title: '请阅读报名须知',
                icon: 'none',
            })
        }
    },
    // 阅读条款
    toRead(e) {
        wx.navigateTo({
            url: '../../page/signUpBook/index'
        });
    }
})