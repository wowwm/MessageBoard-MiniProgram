//连接数据库
const db = wx.cloud.database();
const message = db.collection("message");
const author = db.collection("author");
const lessonSubId = 'wpWjGZ2n58TiFg_tkTpXj3zUhFjmeOaHwNVl1WmSOD4'; //订阅消息模板id

Page({

  data: {
    maxNumber: 140,//可输入最大字数
    number: 0,//已输入字数
    
    show: false,  //是否弹出留言面板
    showReply: false, //是否弹出回复面板
    authority: false, //鉴权
    loading: true,  //是否正在加载
    textValue:"",
    replyMsgId:"",
    qr:"",
    userId:"",  //用户openid

    //留言数据
    pageId:"",
    name:"",
    imageSrc:"",
    goodCount:0,

    
  },

  // 置顶
  toTop:function(e){
    if (!e.currentTarget.dataset.msgdata.top) {
      wx.cloud.callFunction({
        name: 'toTop',
        data: {
          id: e.currentTarget.dataset.msgid,
        }
      }).then(res => {
        wx.showToast({
          title: "置顶成功",
          icon: "success",
          success: res2 => {
            this.getData();
          }
        })
      })
    }else{
      wx.cloud.callFunction({
        name: 'notTop',
        data: {
          id: e.currentTarget.dataset.msgid,
        }
      }).then(res => {
        wx.showToast({
          title: "取消成功",
          icon: "success",
          success: res2 => {
            this.getData();
          }
        })
      })
    }
  },

  //删除
  delect:function(e){
    console.log(e.currentTarget.dataset.msgid)
    wx.cloud.callFunction({
      name: 'delect',
      data:{
        id: e.currentTarget.dataset.msgid,
      }
    }).then(res => {
      wx.showToast({
        title: "删除成功",
        icon: "success",
        success: res2 => {
          this.getData();
        }
      })
    })
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
        // console.log(res)
        this.setData({
          userId: res.result.openid
        })
        db.collection('author').get().then(res2 => {
          // console.log(res.result.event.userInfo.openId)
          // console.log(res2.data[0]._openid)
          if (res.result.openid === res2.data[0]._openid){
            this.setData({
              authority:true
            })
          }
        })
      }
    })
  },

  //提交回复
  reSubmit: function (e) {
    // console.log(e.detail.value.msgInput)
    //订阅消息推送数据
    const item = {
      name1: {
        value: '白小果本果'
      },
      phrase3: {
        value: e.detail.value.msgInput
      }
    }
    //回复
    wx.cloud.callFunction({
      name: 'reply',
      data: {
        id: this.data.replyMsgId,
        reply: e.detail.value.msgInput,
      }
    }).then(res => {
      wx.showToast({
        title: "回复成功",
        icon: "success",
        success: res2 => {
          this.setData({
            textValue: ""
          });
          this.getData();
        }
      });
    })
    // 通知
    wx.cloud.callFunction({
      name: 'replyPush',
      data: {
        data: item,
        templateId: lessonSubId,
        id: this.data.replyMsgId,
        userId:this.data.userId,
        page: `pages/msgPages/msgPages?id=${this.data.pageId}`
      }
    })
  },
 
  //允许订阅回复消息
  subReply:function(e){
    wx.requestSubscribeMessage({
      tmplIds: [lessonSubId],
      success:res => {
        // console.log('已授权接收订阅消息')
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
        pageId:this.data.pageId,
        good: false, //判断有无人点赞
      }
    })
  },

//点赞
  tapGood:function(e){
    console.log(e.currentTarget.dataset.msgid)
    wx.cloud.callFunction({
      name: 'getCount',
      data: {
        id: e.currentTarget.dataset.msgid,
      }
    }).then(res =>{
      if (res.result.data.goodCount == null){
        res.result.data.goodCount=0;
      }
      wx.cloud.callFunction({
        name: 'tapGood',
        data: {
          id: e.currentTarget.dataset.msgid,
          count: Number(res.result.data.goodCount) + 1,
        }
      }).then(res => {
        // console.log(res)
        this.getData()
      })
    })
  },

  // 页面刷新获取数据
  getData:function(e){
    wx.cloud.callFunction({
      name: 'getData',
      data: {
        id:this.data.pageId,
        db:'message',
      }
    }).then(res => {
      // console.log(res.result.data)
      this.setData({
        msgList: res.result.data,
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
  showRe(e){
    this.setData({
      showReply: true ,
      replyMsgId: e.currentTarget.dataset.msgid
    });
  },
  closeRe() {
    this.setData({ showReply: false });
  },

  //获得小程序码
  getQ:function(e){
    wx.cloud.callFunction({
      name: 'getQ',
      data: {
        path: `pages/msgPages/msgPages?id=${this.data.pageId}`,
        id: this.data.pageId,
      }
    }).then(res =>{
      this.setData({
        qr:res.result.fileID
      })
      console.log(res)
      console.log(this.data.qr)
    })
  },


  //复制页面路径
  copyPage:function(e){
    wx.setClipboardData({
      data: `pages/msgPages/msgPages?id=${this.data.pageId}`,
      // success(res) {
      //   wx.getClipboardData({
      //     success(res) {
      //       console.log(res.data) // data
      //     }
      //   })
      // }
    })
  },

  // 监听页面加载
  onLoad: function (options) {
    // console.log(options.id)
    this.authentication();
    this.setData({
      pageId: options.id
    })
    this.getData();
  },

  // 监听下拉
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