//连接数据库
const db = wx.cloud.database();
const message = db.collection("message");

Page({

  data: {
    show: false,
    maxNumber: 140,//可输入最大字数
    number: 0,//已输入字数
    loading: true,
    textValue:"",

    //留言数据
    name:"",
    imageSrc:"",
    text:"",

    msgList:[
      {
        _id:"001",
        imageSrc:"../../images/Rock.png",
        name:"Mengo",
        text:"留言测试1"
      },
    ]
  },

  //获取用户信息
  onInfo:function(e){
    console.log(e.detail.userInfo)
    this.setData({
      imageSrc: e.detail.userInfo.avatarUrl,
      name: e.detail.userInfo.nickName,
    })
  },
 
  //提交留言
  onSubmit:function(e){
    console.log(e.detail.value.msgInput);
    message.add({
      data: {
        imageSrc: this.data.imageSrc,
        name: this.data.name,
        text: e.detail.value.msgInput,
      }
    }).then(res => {
      wx.showToast({
        title: "留言成功",
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

  // 页面刷新
  getData:function(e){
    db.collection('message').get().then(res => {
      console.log(res.data)
      this.setData({
        msgList: res.data,
        loading: false
      })
    })
  },

  //监听记录输入字数
  inputText: function (e) {
    let value = e.detail.value;
    let len = value.length;
    this.setData({
      'number': len
    })
  },

  //弹出面板设置
  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },

  // 监听页面加载
  onLoad: function (options) {
    this.getData();
  },

  // 监听下拉
  onPullDownRefresh: function () {
    this.getData();
    this.setData({
      loading: true
    });
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