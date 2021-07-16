const request = options => {
    const app = getApp();
    wx.request({
        url: app.globalData.apiUrl + options.url,
        data: options.data || {},
        method: 'POST',
        header: {
            'content-type': 'application/json'
        },
        success: options.success || function() {},
        fail: options.fail || function() {},
        complete: options.complete || function() {}
    })
}
const share = () => {
    const app = getApp();
    wx.request({
        url: app.globalData.apiUrl + '/api/index/share',
        data: {
            uid: app.globalData.userInfo.id
        },
        method: 'POST',
        header: {
            'content-type': 'application/json'
        },
        success: res => {

        },
        fail: res => {

        },
        complete: res => {

        }
    })
}
const format = data => {
    var str = data.replace(/&amp;/g, '&');
    var str1 = str.replace(/&nbsp;/g, '\xa0');
    return str1
}


// 屏蔽表情 
function filterEmoji(name) {
    var str = name.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig,"");
    return str;
}

module.exports = {
    request: request,
    share: share,
    // count: count,
    format: format,
    filterEmoji: filterEmoji,
}