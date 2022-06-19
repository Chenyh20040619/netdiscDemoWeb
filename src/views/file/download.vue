<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <span>基于HDFS的分布式文件管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container class="main-container">
      <el-aside width="200px">
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :default-active="this.$route.path"
          router
          unique-opened
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"/>
              <span>文件管理</span>
            </template>
            <el-menu-item index="/download" :route="{name:'download',query:{user: this.user}}">文件编辑</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"/>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/resetEmail" :route="{name:'updateUser',query:{user: this.user}}">编辑信息</el-menu-item>
            <el-menu-item index="/resetPassword" :route="{name:'resetPassword',query:{user: this.user}}">修改密码</el-menu-item>
            <el-menu-item index="/deleteUser" :route="{name:'deleteUser',query:{user: this.user}}">注销账号</el-menu-item>
          </el-submenu>
          <el-menu-item index="/Home" :route="{name:'Home',query:{user: this.user}}">
            <template slot="title">
              <i class="el-icon-sunny"/>
              <span>使用说明</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <div id="op">
          <el-button size="mini" type="primary" icon="el-icon-arrow-left" @click="back">上一级</el-button>
          <!--          新建文件夹-->
          <el-button size="mini" type="primary" @click="dialogVisibleAdd = true" >新建文件夹</el-button>

          <el-dialog
            title="输入"
            :visible.sync="dialogVisibleAdd"
            width="30%">
            <span style="color: #2c2e33">
              <el-input v-model="dirname" placeholder="请输入文件夹名"></el-input>
            </span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleAdd = false" style="background-color: #333744">取 消</el-button>
            <el-button type="primary" @click="addDir">确 定</el-button>
            </span>
          </el-dialog>
        </div>
        <!--        显示位置-->
        <el-input
          v-model="location"
          :disabled="true" style="padding-bottom: 3vw;padding-top: 2vw">
        </el-input>
        <!--        显示目录结构-->
        <div id="dir">
          <li v-for="(item, index) in this.filenames" :key="index" style="border:2px solid #bebebe; position: relative" @click="selectItem(item)">
            <el-button type="text" style="color: #2c2e33" icon="el-icon-folder">
              <div style="color: #333744" @dblclick="into">{{item}}</div>
            </el-button>
            <!--            删除-->
            <el-button type="text" >
              <div>
                <i class="el-icon-delete" style="color: red;" @click="dialogVisibleDelete = true;"/>
              </div>
            </el-button>

            <el-dialog
              title="提示"
              :visible.sync="dialogVisibleDelete"
              width="30%">
              <span style="color: #2c2e33">是否删除该文件</span>
              <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisibleDelete = false" style="background-color: #333744">取 消</el-button>
              <el-button type="primary" v-on:click="deleteFile(item)">确 定</el-button>
              </span>
            </el-dialog>
          </li>
        </div>
        <!--        上传文件-->
        <el-upload
          style="padding-top: 20px"
          :multiple="false"
          :show-file-list="false"
          :http-request="upload"
          action="string"
        >
          <el-button size="small" type="primary"><i class="el-icon-upload el-icon--right">上传文件</i></el-button>
        </el-upload>

        <div style="padding-top: 20px">
          <el-input size="medium" v-model="fileName" placeholder="请输入下载文件名" style="width: 15%;font-size: 15px;color: #2c2e33;padding-right: 5px"></el-input>

          <el-button type="primary" size="medium" v-on:click="download" style="color: #fff;background-color: rgb(21, 47, 72);border-color: rgb(21, 47, 72);">文件下载</el-button>
        </div>
<!--        文本文件-->
        <el-dialog
          title="文件阅览"
          :visible.sync="dialogVisibleDownloadText"
          width="30%">
          <div>
            <el-input
              style="padding-top: 20px"
              type="textarea"
              :rows="10"
              v-model="fileText">
            </el-input>
          </div>
          <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisibleDownloadText = false" style="background-color: #333744">取 消</el-button>
              <el-button type="primary" v-on:click="downloadToLocal">下 载</el-button>
              </span>
        </el-dialog>
<!--        图片-->
        <el-dialog
          title="图片阅览"
          :visible.sync="dialogVisibleDownloadImg"
          width="70%">
          <div id="showImg">
            <img :src="imgUrl" />
          </div>

          <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisibleDownloadImg = false" style="background-color: #333744">取 消</el-button>
              <el-button type="primary" v-on:click="downloadToLocal">下 载</el-button>
              </span>
        </el-dialog>
<!--        视频-->
        <el-dialog
          title="视频阅览"
          :visible.sync="dialogVisibleDownloadVideo"
          width="70%">
          <div class="videoWrap">
            <video-player
              class="video-player vjs-custom-skin"
              ref="videoPlayer"
              :playsinline="true"
              :options="playerOptions"
              @play="onPlayerPlay($event)"
              @pause="onPlayerPause($event)"
              @ended="onPlayerEnded($event)"
              @waiting="onPlayerWaiting($event)"
              @playing="onPlayerPlaying($event)"
              @loadeddata="onPlayerLoadeddata($event)"
              @timeupdate="onPlayerTimeupdate($event)"
              @canplay="onPlayerCanplay($event)"
              @canplaythrough="onPlayerCanplaythrough($event)"
              @statechanged="playerStateChanged($event)"
              @ready="playerReadied">
            </video-player>
          </div>

          <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisibleDownloadVideo = false" style="background-color: #333744">取 消</el-button>
              <el-button type="primary" v-on:click="downloadToLocal">下 载</el-button>
              </span>
        </el-dialog>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import 'video.js/dist/video-js.css';
import { videoPlayer } from 'vue-video-player';
export default {
  components: {
    videoPlayer
  },
  mounted() {
    this.path = "/"+this.user.username
    this.$axios({
      url: 'http://localhost:8080/showDir',
      method: 'post',
      data: {srcPath: this.path}
    }).then(res =>{
      console.log(res.data)
      if (res.data != null){
        this.filenames = res.data
      }
    })
    this.dataStore.push(this.path)
    this.top++
  },
  data: function (){
    return {
      user: {
        id: this.$route.query.user.id,
        username: this.$route.query.user.username,
        password: this.$route.query.user.password,
        email: this.$route.query.user.email
      },

      dataStore: [],
      top: 0,

      // 位置，包含username
      path:"",
      // 下载的文件名
      fileName:'',
      // 目录树
      filenames: [],
      // 显示位置
      location: '/',
      dialogVisibleDelete: false,
      // 下载的文本
      fileText: '',
      dialogVisibleAdd: false,
      dialogVisibleDownloadText: false,
      dialogVisibleDownloadImg: false,
      dialogVisibleDownloadVideo: false,
      // 新建文件夹名
      dirname: '',
      // 选中文件
      deleteItem: '',
      // 图片位置
      imgUrl: '',
      playerOptions : {
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当 true 时，Video.js player 将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            src: '',  // 路径
            type: 'video/mp4'  // 类型
          }
        ],
        poster: require('./../../assets/videoLoad.png'), // 封面地址
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖 Video.js 无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 时间分割线
          durationDisplay: true, // 总时间
          remainingTimeDisplay: true, // 剩余播放时间
          progressControl: true, // 进度条
          fullscreenToggle: true  // 全屏按钮
        }
      }

    }
  },
  methods: {
    logout() {
      this.$router.push('/')
      window.sessionStorage.clear()
      location.reload();
    },

    upload(param) {

      const loading = this.$loading({
        lock: true,
        text: '正 在 上 传. . .',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.76)'
      });
      console.log(this.path)
      this.$axios({
        url: 'http://localhost:8080/upload',
        method: 'post',
        data: {path: this.path, file: param.file},
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then(res=>{
        console.log(res)
        console.log('已经上传')
        if (res.data != null){
          loading.close()
          this.$message.success("上传成功!")
          this.filenames.push(res.data)
        } else {
          this.$message.error("上传失败!")
        }
      })
    },
    back(){
      this.fileName = ''
      if (this.top > 1){
        this.dataStore.pop()
        this.top--
        let peek  = this.top > 0 ? this.dataStore[this.top - 1] : ''
        this.$axios({
          url: 'http://localhost:8080/showDir',
          method: 'post',
          data: {srcPath: peek}
        }).then(res =>{
          if (res.data != null){
            this.location = peek.substr(peek.indexOf('/', 2)) != 1 ? peek.substr(peek.indexOf('/', 2)) : '/'
            this.path = '/' + this.user.username + this.location
            this.filenames = res.data
          }else {
            this.$message.error("请求发生错误")
          }
        })
      }
    },
    into(){
      this.fileName = ''
      let temp = this.path.endsWith('/') ? this.path+this.deleteItem : this.path+'/'+this.deleteItem
      this.dataStore.push(temp)
      this.top++
      let peek  = this.top > 1 ? this.dataStore[this.top - 1] : ''
      this.path = peek
      this.$axios({
        url: 'http://localhost:8080/showDir',
        method: 'post',
        data: {srcPath: peek}
      }).then(res =>{
        if (res.data != null){
          this.location = peek.substr(peek.indexOf('/', 2))
          this.filenames = res.data
        }else {
          this.$message.error("请求发生错误")
        }
      })
    },
    selectItem(item){
      this.deleteItem=item
      this.fileName = item
    },
    addDir(){
      this.dialogVisibleAdd = false
      this.$axios({
        url: 'http://localhost:8080/file/mkdir',
        method: 'post',
        data: {srcPath: this.path+'/'+this.dirname},
      }).then(res=>{
        if (res.data == true){
          this.$message.success("创建文件夹成功！")
          this.filenames.push(this.dirname)
        } else {
          this.$message.error("创建文件夹失败!")
        }
      })
    },
    deleteFile() {
      console.log('deleteItem'+this.deleteItem)
      this.dialogVisibleDelete = false
      this.$axios({
        url: 'http://localhost:8080/file/delete',
        method: 'post',
        data: {srcPath: this.path+'/'+this.deleteItem,recursive: true},
      }).then(res=>{
        if (res.data == true){
          this.$message.success("删除成功！")
          this.$axios({
            url: 'http://localhost:8080/showDir',
            method: 'post',
            data: {srcPath: this.path}
          }).then(res =>{
            if (res.data != null){
              this.filenames = res.data
            }
          })
        } else {
          this.$message.error("删除失败!")
        }
      })
    },
    download(){
      if (this.fileName.endsWith('.txt')) {
        this.dialogVisibleDownloadText = true
        // if (this.path == ""){
        //   alert("请输入下载文件路径")
        //   return
        // }
        const loading = this.$loading({
          lock: true,
          text: '正 在 下 载. . .',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.76)'
        });
        this.$axios.get('http://localhost:8080/download', {
          params: {
            path: this.path+"/"+this.fileName
          },
        }).then(res=>{
          console.log(res)
          if (res.data != ''){
            this.fileText = res.data
            loading.close()
          } else {
            this.$message.error("加载失败")
            loading.close()
          }
        })
      }
      else if (this.fileName.endsWith('.png')||this.fileName.endsWith('.jpg')) {
        this.dialogVisibleDownloadImg = true

        const loading = this.$loading({
          lock: true,
          text: '正 在 下 载. . .',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.76)'
        });
        this.$axios.get('http://localhost:8080/download', {
          params: {
            path: this.path+"/"+this.fileName,
          },
          responseType: 'blob',
        }).then(res=>{
          console.log(res)
          if (res.data != ''){
            this.fileText = res.data

            let blob = new Blob([res.data], {type: 'image/jpeg'});
            this.imgUrl = URL.createObjectURL(blob);
            console.log(this.imgUrl)
            loading.close()
          } else {
            this.$message.error("加载失败")
            loading.close()
          }
        })
      }
      else if (this.fileName.endsWith('.mp4')) {
        this.dialogVisibleDownloadVideo = true

        const loading = this.$loading({
          lock: true,
          text: '正 在 下 载. . .',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.76)'
        });
        console.log("begin")
        this.$axios.get('http://localhost:8080/download', {
          params: {
            path: this.path+"/"+this.fileName,
          },
          responseType: 'blob',
        }).then(res=>{
          console.log(res)
          if (res.data != ''){
            this.fileText = res.data

            let blob = new Blob([res.data]);
            // this.playerOptions['sources'][0]['src'] = URL.createObjectURL(blob);
            // if (this.fileName == 'test.mp4') {
            //   this.playerOptions['sources'][0]['src'] = require('./../../assets/test.mp4');
            // }
            // if (this.fileName == '风景.mp4') {
            //   this.playerOptions['sources'][0]['src'] = require('./../../assets/test.mp4');
            // }
            this.playerOptions['sources'][0]['src'] = require('./../../assets/'+this.fileName);
            loading.close()
          } else {
            this.$message.error("加载失败")
            loading.close()
          }
        })
      }
      else {
        this.$message.error('该类型文件不能下载')
        return
      }

    },
    // 文本点击下载
    downloadToLocal() {
      let blob = new Blob([this.fileText]);
      let a = document.createElement("a");
      a.style.display = "none";

      // 对象 URL 绑定到 a 标签上
      a.href = window.URL.createObjectURL(blob);

      // 给 a 标签添加 download 属性 与 文件名
      a.download = this.fileName

      // 把 a 标签挂载到 dom 树上并执行 a 标签的 click 事件
      document.body.appendChild(a);
      a.click();

      // 释放我们创建的 url 和 a 标签
      window.URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
    },
// 播放回调
    onPlayerPlay(player) {
      console.log("player play!", player);
    },
    // 暂停回调
    onPlayerPause(player) {
      console.log("player pause!", player);
    },
    // 视频播完回调
    onPlayerEnded(player) {
      console.log("player end!", player);
    },
    // DOM元素上的readyState更改导致播放停止
    onPlayerWaiting(player) {
      console.log("Player Waiting",player);
    },
    // 已开始播放回调
    onPlayerPlaying(player) {
      console.log("Player Playing",player);
    },
    // 当播放器在当前播放位置下载数据时触发
    onPlayerLoadeddata(player) {
      console.log("Player Loadeddata",player);
    },
    // 当前播放位置发生变化时触发。
    onPlayerTimeupdate(player) {
      console.log("Player Timeupdate",player);
    },
    // 媒体的readyState为HAVE_FUTURE_DATA或更高
    onPlayerCanplay(player) {
      console.log('player Canplay!', player)
    },
    // 媒体的readyState为HAVE_ENOUGH_DATA或更高。这意味着可以在不缓冲的情况下播放整个媒体文件。
    onPlayerCanplaythrough(player) {
      console.log('player Canplaythrough!', player)
    },
    //播放状态改变回调
    playerStateChanged(playerCurrentState) {
      console.log("player current update state", playerCurrentState);
    },
    //将侦听器绑定到组件的就绪状态。与事件监听器的不同之处在于，如果ready事件已经发生，它将立即触发该函数。。
    playerReadied(player) {
      console.log("example player 1 readied", player);
    },
  },
  name: "download",
}
</script>
<style>

</style>
