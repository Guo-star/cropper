import WeCropper from '../../components/we-cropper/we-cropper.js'

const app = getApp();
const appData = app.globalData;

// 设置宽高
const width = appData.systemInfo.windowWidth // 示例为一个与屏幕等宽的正方形裁剪框
const height = appData.systemInfo.windowHeight - 50


Page({

  /**
   * 页面的初始数据
   */
  data: {
    cropperOpt: {
      id: 'cropper',
      width, // 画布宽度
      height, // 画布高度
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: {
        x: (width - 300) / 2, // 裁剪框x轴起点
        y: (height - 300) / 2, // 裁剪框y轴期起点
        width: 300, // 裁剪框宽度
        height: 300 // 裁剪框高度
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    this.init();

    // 直接显示上传的图片
    // this.wecropper.pushOrign(appData.portrait);
    this.wecropper.pushOrign("http://img3.imgtn.bdimg.com/it/u=2500481075,2713023710&fm=26&gp=0.jpg");
  },

  /**
   * 初始化
   */
  init() {
    const {
      cropperOpt
    } = this.data

    new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        // console.log(`before picture loaded, i can do something`)
        // console.log(`current canvas context:`, ctx)
        wx.showToast({
          title: '加载中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        // console.log(`picture loaded`)
        // console.log(`current canvas context:`, ctx)
        wx.hideToast()
      })
      .on('beforeDraw', (ctx, instance) => {
        // console.log(`before canvas draw,i can do something`)
        // console.log(`current canvas context:`, ctx)
      })
      .updateCanvas()
  },

  /**
   * 确定剪裁
   */
  getCropperImage() {
    this.wecropper.getCropperImage((src) => {
      if (src) {
        wx.previewImage({
          urls: [src]
        })
      } else {
        console.log('获取图片地址失败，请稍后重试')
      }
    })
  },

  /**
   * 取消剪裁
   */
  cancelCropper() {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 上传图片
   */
  uploadTap() {
    const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值

        self.wecropper.pushOrign(src)
      }
    })
  },

  /**
   * 传递事件
   */
  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  }

})