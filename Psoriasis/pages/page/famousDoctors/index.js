import post from "../../../utils/request"
const indexList = [];
const charCodeOfA = 'A'.charCodeAt(0);
for (let i = 0; i < 26; i++) {
    indexList.push(String.fromCharCode(charCodeOfA + i));
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        doctor: [],
        page: 1,
        limit: 10,
        count: '',
        type: '',
        indexList
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        const type = Number(options.id)
        this.setData({
            type
        })
        console.log(this.data.type);

        this.getDoctor(this.data.type)
    },
    s(e) {
        console.log(e);
    },
    getDoctor(type) {
        let that = this
        post({
            url: '/doctor/list',
            data: {
                type
            }
        }).then(res => {
            const {
                code,
                data
            } = res.data
            if (code === 200) {
                const doctor = data.results
                that.setData({
                    doctor
                })
            }
        })
    },
    toPage(e) {
        const
            id = e.currentTarget.dataset.id,
            type = this.data.type
        wx.navigateTo({
            url: `./detail?id=${id}&type=${type}`,
        });
    }
})