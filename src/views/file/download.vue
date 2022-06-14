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
            <el-menu-item index="/upload" :route="{name:'upload',query:{user: this.user}}">文件上传</el-menu-item>
            <el-menu-item index="/download" :route="{name:'download',query:{user: this.user}}">文件下载</el-menu-item>
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
              <span>关于我们</span>
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
            <el-button @click="dialogVisibleAdd = false">取 消</el-button>
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
        <div style="padding-top: 20px">
          <el-input size="medium" v-model="fileName" placeholder="请输入下载文件名" style="width: 15%;font-size: 15px;color: #2c2e33;padding-right: 5px"></el-input>
          <el-button type="primary" size="medium" v-on:click="download" style="color: #fff;background-color: rgb(21, 47, 72);border-color: rgb(21, 47, 72);">立即下载</el-button>
        </div>
        <div>
          <el-input
            style="padding-top: 20px"
            type="textarea"
            :rows="10"
            v-model="downloadText">
          </el-input>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
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

      path:"",
      fileName:'',
      filenames: [],
      location: '/',
      dialogVisibleDelete: false,
      downloadText: '',
      dialogVisibleAdd: false,
      dirname: '',
      deleteItem: '',
    }
  },
  methods: {
    logout() {
      this.$router.push('/')
      window.sessionStorage.clear()
      location.reload();
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
      if (this.path == ""){
        alert("请输入下载文件路径")
        return
      }
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
          this.downloadText = res.data
          loading.close()
          this.$message.success("成功下载")
        } else {
          this.$message.error("下载失败")
          loading.close()
        }
      })
    }
  },
  name: "download",
}
</script>
<style>

</style>
