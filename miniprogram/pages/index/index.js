//连接数据库
const db = wx.cloud.database();
const message = db.collection("message");

Page({

  data: {
    show: false,
    maxNumber: 140,//可输入最大字数
    number: 0,//已输入字数

    //留言数据
    nickName:"",
    imageSrc:"",
    text:"",



    msgList:[
      {
        id:"001",
        imageSrc:"../../images/Rock.png",
        name:"Mengo",
        text:"留言测试1"
      },
      {
        id: "002",
        imageSrc: "../../images/Baba.png",
        name: "Mike",
        text: "留言测试23xfffffffffffffffffffff怎么让小程序text自动换行?小程序text自动换行方该怎么做?下面小编就为您讲述让小程序的text自动换行的方法详解,一起来看看吧。,"
      },
      {
        id: "003",
        imageSrc: "../../images/Flag.png",
        name: "JUne",
        text: "留言测试3"
      },
    ]
  },

  //获取用户信息
  onInfo:function(e){
    console.log(e.detail.userInfo)
    // message.add({
    //   data:{
    //     imageSrc: e.detail.userInfo.avatarUrl,
    //     name: e.detail.userInfo.nickName,
    //   }
    // })
  },
 

  //提交留言
  onSubmit:function(e){
    console.log(e.detail);

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


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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