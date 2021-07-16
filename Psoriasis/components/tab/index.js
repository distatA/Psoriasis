// components/tab/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        item:{
            type: Array,
            value: []
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        nav:0,
        tabArr: [{
            value:'会议简介',
        },
        {
            value:'会议组织',
        },
        {
            value:'会议致辞',
        },]
    },

    /**
     * 组件的方法列表
     */
    methods: {
        setNavTap: function (e) {
            let nav = e.currentTarget.dataset.index;
            this.setData({
                nav
            });
        },
    }
})