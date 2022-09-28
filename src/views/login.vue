<template>
  <!-- 登录页 -->
  <!-- login page -->
  <v-app>
    <v-container>
      <v-card min-width="300px" height="480px" max-width="600px" style="margin:10vh auto;padding:15px">

        <div class="login-title" style="display:flex; justify-content:center;">
          <img src="../assets/i/favicon.png" height="45" />
          <span class="login-title">{{$vuetify.lang.t("$vuetify.systemName") }}</span>
        </div>

        <v-divider style="margin:24px"></v-divider>
        <!-- 登录表单 -->
        <!-- login form -->
        <div style="display: flex; justify-content:center;">
          <v-form ref="form" class="login-form" v-model="data">
            <v-container>
              <v-input>{{ $vuetify.lang.t("$vuetify.account.username")}}</v-input>
              <v-text-field placeholder="" :rules="[v => !!v || $vuetify.lang.t('$vuetify.account.nameRules')]" required
                ref="username" data-name="username" solo autofocus v-model="form.username" @keyup.enter="login()">
              </v-text-field>
              <v-input>{{ $vuetify.lang.t("$vuetify.account.password")}}</v-input>
              <v-text-field type="password" :rules="[v => !!v || $vuetify.lang.t('$vuetify.account.pwsRules') ]"
                required data-name="password" solo v-model="form.password" @keyup.enter="login()">
              </v-text-field>
              <v-btn id="login-button" @click="login()">
                {{$vuetify.lang.t('$vuetify.account.signIn') }}</v-btn>
            </v-container>
          </v-form>
        </div>
      </v-card>
      <!-- 隐私授权 -->
      <!-- privacy authorization -->
      <v-dialog v-model="unauthorized" max-width="400" persistent>
        <v-card>
          <v-card-title>{{$vuetify.lang.t('$vuetify.login.authorizationTitle')}}</v-card-title>
          <v-card-text>{{$vuetify.lang.t('$vuetify.login.authorizationInfo')}}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="agree">
              {{$vuetify.lang.t('$vuetify.login.agree')}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- tips -->
      <v-snackbar v-model="snackbar" :color="color" id="warning" :timeout="3000" :top="true">
        {{ text }}
      </v-snackbar>
    </v-container>
  </v-app>
</template>
<script>
//import axios from '../api/axios.js'
import axios from "axios";
import commonCfg from '../config/common'
import qs from 'qs'

export default {
  data () {
    return {
      data: true,
      // tips
      snackbar: false,
      color: 'error',
      unauthorized: true,
      text: '',
      // 登录表单
      // log form
      form: {
        //grant_type: 'password',
        username: localStorage.username || '',
        password: ''
      }
    }
  },
  created () {

  },
  mounted () {
    if (localStorage.unauthorized == 'false') {
      this.unauthorized = false

    }
    console.log(this.unauthorized)
  },
  methods: {
    login () {
      if (this.$refs.form.validate()) {
        axios.post(commonCfg.login, qs.stringify(this.form))
          //在使用另一个函数调用它时从promise中获取值
          //Get value from promise when calling it with another function
          .then(res => {
            if (res) {
              //document.cookie = 'token=' + res.access_token + '; path=/' //token放进cookie里 token in cookie
              localStorage.setItem('token', res.data.access_token)
              localStorage.setItem('refresh_token', res.data.refresh_token)
              localStorage.username = this.form.username
              this.$router.push('/stationList')
            } else {
              this.text = 'error'
              this.snackbar = true
            }
          }).catch(error => {
            this.text = 'error'
            this.snackbar = true
            console.log(error)
          })
      }
    },
    //
    agree () {
      this.unauthorized = false
      localStorage.unauthorized = false
    },
  }
}
</script>
<style>
.login-form {
  margin-top: 20px;
  width: 300px;
  text-align: center;
}
.login-title {
  font-size: 32px;
  font-weight: bolder;
  padding-top: 5px;
}
#login-button {
  width: 60px;
  color: #fff;
  background: linear-gradient(
    to bottom,
    rgba(30, 87, 153, 1) 0%,
    rgba(41, 137, 216, 1) 50%,
    rgba(32, 124, 202, 1) 51%,
    rgba(125, 185, 232, 1) 100%
  );
  border-color: #409eff;
  margin-top: 30px;
  cursor: pointer;
}
.v-application .error--text {
  color: #ff5252 !important;
  caret-color: #ff5252 !important;
}
</style>
