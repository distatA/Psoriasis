const app = getApp()
const post = params => {
    return new Promise((resolve, reject) => {
        wx.request({
            // 解构出调用axios时传进来的数据 
            ...params,
            method: 'POST',
            url: app.globalData.baseUrl + params.url,
            header: {
                'content-type': 'application/json'
            },
            success: (result) => {
                if (result.data.code === 1000) {
                    wx.showToast({
                        title: result.data.msg,
                        icon: 'none',
                    })
                }
                resolve(result);
            },
            fial: (error) => {
                // 提示 
                wx.showToast({
                    title: '数据获取失败',
                    icon: 'none',
                });

                reject(error);

            },
            complete: () => {

            }
        });
    });
};
export default post