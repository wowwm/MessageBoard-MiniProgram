//连接数据库
const db = wx.cloud.database();
const message = db.collection("message");
const author = db.collection("author");

Page({

  data: {
    maxNumber: 140,//可输入最大字数
    number: 0,//已输入字数
    
    show: false,  //是否展示弹出面板
    authority: false, //鉴权
    loading: true,  //是否正在加载
    textValue:"",

    //留言数据
    name:"",
    imageSrc:"",

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
    if (e.detail.errMsg === "getUserInfo:ok"){
      this.showPopup()
      this.setData({
        imageSrc: e.detail.userInfo.avatarUrl,
        name: e.detail.userInfo.nickName,
      })
    }
  },

  //判断用户权限
  authentication:function(){   
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        db.collection('author').get().then(res2 => {
          // console.log(res.result.userInfo.openId)
          // console.log(res2.data[0]._openid)
          if (res.result.userInfo.openId === res2.data[0]._openid){
            this.setData({
              authority:true
            })
          }
        })
      }
    })
  },



 
  //提交留言
  onSubmit:function(e){
    // console.log(e.detail.value.msgInput);
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

  // 页面刷新获取数据
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
    this.authentication();
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