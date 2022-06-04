<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <span>Hello! {{user.username}}</span>
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
        <div>
          <el-input v-model="path" placeholder="请输入下载文件路径" style="width: 10%;font-size: 15px;color: #2c2e33;"></el-input>
          <el-button v-on:click="download" style="color: #fff;background-color: rgb(21, 47, 72);border-color: rgb(21, 47, 72);">立即下载</el-button>
        </div>
        <div style="padding: 20px">
          <el-input
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
  data: function (){
    return {
      user: {
        id: this.$route.query.user.id,
        username: this.$route.query.user.username,
        password: this.$route.query.user.password,
        email: this.$route.query.user.email
      },
      path:"",
      downloadText: ''
    }
  },
  methods: {
    logout() {
      this.$router.push('/')
      window.sessionStorage.clear()
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
          path: "/"+this.user.username+"/"+this.path
        },
      }).then(res=>{
        console.log(res)
        if (res.data != ''){
          this.downloadText = res.data
          loading.close()
          this.$message.success("成功下载")
          this.path = ""
        } else {
          this.$message.error("下载失败")
          loading.close()
          this.path = ""
        }
      })
    }
  },
  name: "download",
}
</script>
<style>

</style>
