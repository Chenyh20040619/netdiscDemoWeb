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
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
          style="width:350px"
        >
          <el-form-item label="原密码" prop="oldPass">
            <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm" style="color: #fff;background-color: rgb(21, 47, 72);border-color: rgb(21, 47, 72);">重置</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data: function (){
// 效验新密码是否一致
    const validatePass = (rule, value, callback) => {
      // value代表第三个框的确认密码checkPass
      if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };

    return {
      user: {
        id: this.$route.query.user.id,
        username: this.$route.query.user.username,
        password: this.$route.query.user.password,
        email: this.$route.query.user.email
      },
      ruleForm: {
        oldPass: "",
        pass: "",
        checkPass: ""
      },
      rules: {
        oldPass: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          },
        ],
        pass: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ],
        checkPass: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          },
          {validator: validatePass, trigger: "change"}
        ]
      },
    }
  },
  methods: {
    logout() {
      this.$router.push('/')
      window.sessionStorage.clear()
    },
    submitForm() {
      if (this.user.password !== this.ruleForm.oldPass){
        console.log(this.user.password)
        console.log(this.ruleForm.oldPass)
        this.$message.error("原密码错误！")
      }else {
        this.$axios({
          url: 'http://localhost:8080/resetPassword',
          method: 'post',
          data: {id: this.user.id, password: this.ruleForm.pass},
        }).then(res=>{
          if (res.data == 1){
            this.$message.success("修改成功")
            this.user.password = this.ruleForm.pass
            this.resetForm()
          } else {
            this.$message.error("修改失败")
          }
        })
      }
    },
    resetForm(){
      this.ruleForm.pass = ''
      this.ruleForm.checkPass = ''
      this.ruleForm.oldPass = ''
    }
  },
  name: "resetPassword",
}
</script>

