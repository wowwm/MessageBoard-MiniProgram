//连接数据库
const db = wx.cloud.database();
const msgpages = db.collection("msgpages");
const author = db.collection("author");
Page({


  data: {
    authority: false,
    show: false,  //是否弹出留言面板
    textValue: "",
    loading: true,  //是否正在加载

    pageList:[]
  },

  newPage:function(e){
    
  },

  //提交创建新页面
  onSubmit: function (e) {
    console.log(e.detail.value.msgInput);
    msgpages.add({
      data: {
        name: e.detail.value.pageName,
        discribe: e.detail.value.pageDiscribe,
      }
    }).then(res => {
      wx.showToast({
        title: "新建成功",
        icon: "success",
        success: res2 => {
          this.setData({
            textValue: ""
          });
          this.getData();
        }
      })
    })
  },

  // 页面刷新获取数据
  getData: function (e) {
    wx.cloud.callFunction({
      name: 'getData',
      data: {
        db: 'msgpages',
        id: null,
      }
    }).then(res => {
      console.log(res.result.data)
      this.setData({
        pageList: res.result.data,
        loading: false
      })
      // wx.stopPullDownRefresh
    })
  },

  //判断用户权限
  authentication: function () {
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        db.collection('author').get().then(res2 => {
          if (res.result.userInfo.openId === res2.data[0]._openid) {
            this.setData({
              authority: true
            })
          }
        })
      }
    })
  },

  //弹出面板设置
  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },

  onLoad: function (options) {
    this.getData();
    this.authentication();
  },

  onPullDownRefresh: function () {
    this.setData({
      loading: true
    });
    this.getData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})