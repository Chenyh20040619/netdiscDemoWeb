<template>  <div class="login-container">
  <div class="pageHeader">
    <span>网盘Test</span>
  </div>

  <div class="login-box">
    <div class="login-text" v-if="typeView != 2">
      <a href="javascript:;" :class="typeView == 0 ? 'active' : ''" @click="handleTab(0)">登录</a>
      <b>·</b>
      <a href="javascript:;" :class="typeView == 1 ? 'active' : ''" @click="handleTab(1)">注册</a>
    </div>
    <!-- 登录模块 -->
    <div class="right-content" v-show="typeView == 0">
      <div class="input-box">

        <input
          autocomplete="off"
          type="text"
          class="input"
          v-model="formLogin.id"
          placeholder="请输入id"
        />
        <input
          autocomplete="off"
          type="password"
          class="input"
          v-model="formLogin.password"
          maxlength="20"
          @keyup.enter="login"
          placeholder="请输入登录密码"
        />
      </div>
      <Button
        class="loginBtn"
        type="primary"
        :disabled="isDisabled"
        :loading="isLoading"
        @click.stop="login">
        立即登录
      </Button>

      <div class="option">
        <input type="checkbox" class="remember" v-model="checked" value="true" id="rem">
        <label for="rem">记住我</label>
      </div>
    </div>

    <!-- 注册模块 -->
    <div class="right_content" v-show="typeView == 1">
      <div class="input-box">
        <input
          autocomplete="off"
          type="text"
          class="input"
          v-model="formRegister.id"
          placeholder="请输入id"
        />
        <input
          autocomplete="off"
          type="text"
          class="input"
          v-model="formRegister.email"
          placeholder="请输入邮箱"
        />
        <input
          autocomplete="off"
          type="text"
          class="input"
          v-model="formRegister.username"
          placeholder="请输入用户名"
        />
        <input
          autocomplete="off"
          type="password"
          class="input"
          v-model="formRegister.password"
          maxlength="20"
          @keyup.enter="register"
          placeholder="请输入密码"
        />
        <input
          autocomplete="off"
          type="password"
          class="input"
          v-model="formRegister.password2"
          maxlength="20"
          @keyup.enter="register"
          placeholder="请再次确认密码"
        />
      </div>
      <Button
        class="loginBtn"
        type="primary"
        :disabled="isRegAble"
        :loading="isLoading"
        @click.stop="register">
        立即注册
      </Button>
    </div>

  </div>
</div>
</template>

<script>
export default {
  name: "login.vue",
  mounted() {
    this.getCookie();
  },
  computed: {
    // 登陆按钮状态
    isDisabled() {
      return !(this.formLogin.id && this.formLogin.password);
    },
    // 注册按钮状态
    isRegAble() {
      return !(this.formRegister.id && this.formRegister.password && this.formRegister.password2);
    },
  },
  data() {
    return {
      formLogin: {
        id: '',
        password: '',
      },
      formRegister: {
        id: '',
        email: '',
        username: '',
        password: '',
        password2: '',
      },
      typeView: 0,
      checked: false,
      isLoading: false,
    };
  },
  methods: {
    handleTab(type) {
      this.typeView = type;
      this.clearInput();
    },
    // 返回登录界面
    selectLogin() {
      this.typeView = 0;
      this.clearInput();
    },
    // 立即登录
    login() {
      if (this.isDisabled || this.isLoading) {
        return false;
      }

      // 判断复选框是否被勾选，勾选则调用配置cookie方法
      if (this.checked) {
        // 传入账号名，密码，和保存天数3个参数
        this.setCookie(this.formLogin.id, this.formLogin.password, 7);
      } else {
        this.clearCookie();
      }

      this.isLoading = true;
      console.log("111")
      this.$axios.post('http://localhost:8080/toLogin', this.formLogin)
      .then(res=>{
        this.loginLoading = false
        this.$router.push({name: 'Home', params: {user: res.data}})
      })
    },

    // 立即注册
    register() {
      if (this.isRegAble || this.isLoading) {
        return false;
      }
      this.isLoading = true;

      this.$axios.post('http://localhost:8080/register', {
        id: this.formRegister.id,
        username: this.formRegister.username,
        password: this.formRegister.password2,
        email: this.formRegister.email,
      })
        .then(res=>{
          this.loginLoading = false
          this.handleTab(0)
        })

    },

    setCookie(id, password, exdays) {
      // 获取时间
      let exdate = new Date();
      // 保存的天数
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays);
      // 字符串拼接cookie
      window.document.cookie = 'id' + '=' + id + ';path=/;expires=' + exdate.toUTCString();
      window.document.cookie = 'password' + '=' + password + ';path=/;expires=' + exdate.toUTCString();
    },

    // 读取cookie
    getCookie() {
      if (document.cookie.length > 0) {
        // 这里显示的格式需要切割一下自己可输出看下
        let arr = document.cookie.split('; ');
        for (let i = 0; i < arr.length; i++) {
          // 再次切割
          let arr2 = arr[i].split('=');
          // 判断查找相对应的值
          if (arr2[0] == 'id') {
            // 保存数据并赋值
            this.formLogin.id = arr2[1];
          } else if (arr2[0] == 'password') {
            this.formLogin.password = arr2[1];
          }
        }
      }
    },
    //清除cookie
    clearCookie() {
      // 修改前2个值都为空，天数为负1天就好了
      this.setCookie('', '', -1);
    },
    checkChange(status) {
      console.log(status);
      this.checked = status;
    },
    // 清空输入框
    clearInput() {
      this.formLogin = {
        id: '',
        password: '',
      }
      this.formRegister = {
        id: '',
        username: '',
        email: "",
        password: '',
        password2: '',
      }
      this.checked = false
      this.isLoading = false
    }
  },
};
</script>
