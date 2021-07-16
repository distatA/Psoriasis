import post from "../../../utils/request"
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        phone: '', // 手机号
        name: '', // 姓名
        sex: 1, // 性别 
        showSex: false, // 性别弹窗 
        showJoin: false, // 参加弹窗
        sfz: '',
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
        checked: false,
        codeText: '获取验证码', // 验证码文本
        disabled: false, //是否禁用按钮
        fileListZheng: [], //证件正面数据
        fileListBei: [], //证件背面数据
        currentTime: '', //验证码秒数
        multiArray: [],
        multiIndex: [0, 0, 0],
        districtId: 0,
        region: [],
        showTips: false,
        userInfo: '', //用户信息
        notPhone: false,
        cityId: 0,
        provinceId: 0,
        compatibility: false
    },

    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        // 兼容手机高度
        const SystemInfo = wx.getSystemInfoSync();
        console.log(SystemInfo.screenHeight);
        if (SystemInfo.screenHeight < 700) {
            this.setData({
                compatibility: true
            })
        }
        const userInfo = wx.getStorageSync('userInfo')
        this.getArea()
        setTimeout(() => {
            if (userInfo.phone) {
                console.log('获取到手机号', phone);
                const phone = userInfo.phone + ''
                this.setData({
                    phone,
                    userInfo
                })
                console.log(phone);
            } else {
                console.log('获取不到手机号');
                this.setData({
                    notPhone: true
                })
            }
        }, 2000)

    },
    getUserInfo(event) {
        console.log(event.detail);
    },
    onClose() {
        this.setData({
            close: false
        });
    },
    onChange(e) {
        this.setData({
            checked: e.detail,
        });
    },
    // 上传证件正面
    afterReadZheng(event) {
        let that = this
        const {
            file
        } = event.detail;
        wx.uploadFile({
            url: 'https://api-hospital.schoolpi.net/upload', //仅为示例，非真实的接口地址
            filePath: file.path,
            name: 'file',
            header: {
                "Content-Type": "multipart/form-data",
            },
            success(result) {
                console.log(result);
                const res = JSON.parse(result.data)
                that.setData({
                    fileListZheng: res.data
                })
                console.log(that.data.fileListZheng);
            }
        })
    },
    // 上传证件背面
    afterReadBei(event) {
        console.log(event);
        const {
            file
        } = event.detail;
        let that = this
        wx.uploadFile({
            url: 'https://api-hospital.schoolpi.net/upload', //仅为示例，非真实的接口地址
            filePath: file.path,
            name: 'file',
            header: {
                "Content-Type": "multipart/form-data",
            },
            success(result) {
                const res = JSON.parse(result.data)
                that.setData({
                    fileListBei: res.data
                })
                console.log(that.data.fileListBei);
            }
        })
    },
    // 发送验证码 
    sendMsg() {
        console.log("ok")
        this.waitCode();
        this.setData({
            disabled: true
        })
    },
    // 验证码定时器 
    waitCode() {
        var interval
        var currentTime = 5
        interval = setInterval(() => {
            currentTime--;
            this.setData({
                codeText: currentTime + '秒后重新发送'
            })
            if (currentTime <= 0) {
                clearInterval(interval)
                this.setData({
                    codeText: '获取验证码',
                    currentTime: 5,
                    disabled: false
                })
            }
        }, 1000)
    },
    // 地区选择 
    bindRegionChange(e) {
        console.log(e.detail.value);
        const areaArr = e.detail.value
        const regionCode = e.detail.code

        this.setData({
            region: areaArr,
            regionCode

        })
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

    //   选择完毕  
    onClose() {
        this.setData({
            showSex: false,
            showJoin: false
        });
    },
    // 取消选择
    cancel() {
        this.setData({
            showSex: false,
            showJoin: false
        });
    },

    // 性别选择 
    onSelectSex(e) {
        console.log(e.detail);
        if (e.detail.name === '男') {
            this.setData({
                sex: 1
            })
            console.log(this.data.sex);
        } else {
            this.setData({
                sex: 2
            })
            console.log(this.data.sex);
        }
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
    // 身份证输入框
    changeId(e) {
        const sfz = e.detail
        this.setData({
            sfz
        })
    },
    getArea() {
        post({
            url: '/area'
        }).then(res => {
            if (res.data.code != 200) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                })
                
              }
            // const area = res.data.data.result
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
        // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
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
        console.log(districtId);
    },
    // 提交 
    submit() {
        const {
            name,
            phone,
            sex,
            region,
            checked,
            sfz,
            fileListZheng,
            fileListBei,
            provinceId,
            cityId,
            districtId,
        } = this.data
        console.log(name.length, phone.length, sfz.length);
        // console.log(region, provinceId,
        //     cityId,
        //     districtId,);
        if (name && phone && sex && region && sfz.length === 18 && checked && app.globalData.userId && fileListZheng && fileListBei && districtId && cityId && provinceId) {
            console.log('完整');
            post({
                url: '/freeClinic/write',
                data: {
                    version:1,
                    name,
                    phone,
                    gender: sex,
                    id_card: sfz,
                    address: region,
                    id_card_front: fileListZheng.path,
                    id_card_back: fileListBei.path,
                    user_id: app.globalData.userId,
                    area_code: districtId,
                    province_code: provinceId,
                    city_code: cityId
                }
            }).then(res => {
                console.log(res);
                if (res.data.code === 200) {
                    wx.showModal({
                        title: '温馨提示',
                        content: '恭喜您已预约成功,可在我的预约中查看',
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                wx.switchTab({
                                    url: '../../tabbar/exhibition/index',
                                })
                            }
                        }
                    })
                } else {
                    wx.showToast({
                        title: res.data.msg,
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
            return
        } else if (!phone) {
            wx.showToast({
                title: '请填写正确的手机号',
                icon: 'none',
            })
            return
        } else if (!sex) {
            wx.showToast({
                title: '请填写性别',
                icon: 'none',
            })
            return
        } else if (!region || !districtId) {
            wx.showToast({
                title: '请选择地区',
                icon: 'none',
            })
            return
        } else if (!sfz || sfz.length !== 18) {
            wx.showToast({
                title: '请填写正确的身份证',
                icon: 'none',
            })
            return
        } else if (!fileListZheng) {
            wx.showToast({
                title: '请上传证件照正面',
                icon: 'none',
            })
            return
        } else if (!fileListBei) {
            wx.showToast({
                title: '请上传证件照背面',
                icon: 'none',
            })
            return
        } else if (!checked) {
            wx.showToast({
                title: '请阅读义诊须知',
                icon: 'none',
            })
        }
    },
    // 阅读协议 
    toRead() {
        wx.navigateTo({
            url: '../../page/subscribeBook/index',
        });
    }
})