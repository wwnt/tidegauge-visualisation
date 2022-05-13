<template>
  <v-container>
    <v-card min-width="300px" max-width="600px" style="margin:10vh auto;padding:15px">
      <div class="login-title" style="display:flex; justify-content:center;">
        <span class="login-title">{{ $vuetify.lang.t("$vuetify.account.accountSignUp")}}</span>
      </div>
      <v-divider style="margin:24px"></v-divider>

      <v-card-text>
        <v-form ref="form" v-model="data">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field :label="$vuetify.lang.t('$vuetify.userconfig.username')"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.account.nameRules')]" v-model="form.username" value
                  required>
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <!-- 检查邮箱格式是否正确 -->
                <!--check email format -->
                <v-text-field :label="$vuetify.lang.t('$vuetify.userconfig.mail')"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.userconfig.mailRequire'), v => /.+@.+\..+/.test(v) || $vuetify.lang.t('$vuetify.userconfig.mailValid'),]"
                  v-model="form.email" required>
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field :label="$vuetify.lang.t('$vuetify.userconfig.password')" v-model="form.password"
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.account.pwsRules')]" value required type="password">
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field :label="$vuetify.lang.t('$vuetify.userconfig.confirmPassword')" v-model="confirmPassword"
                  :rules="[v => v==form.password || $vuetify.lang.t('$vuetify.userconfig.confirmPasswordRules'),v => !!v || $vuetify.lang.t('$vuetify.userconfig.confirmPasswordRules')]"
                  value required type="password">
                </v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="apply()">{{
            $vuetify.lang.t('$vuetify.userconfig.save')
          }}</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
    <v-snackbar v-model="msgSnackbar" :color="color" :top="true" timeout="3000" class="pt-1">
      {{msg}}
    </v-snackbar>

  </v-container>
</template>
<script>
import axiosTool from '../api/axios.js'
export default {
  data () {
    return {
      data: true,
      // tips
      msgSnackbar: false,
      color: 'error',
      msg: '',

      form: {
        email: '',
        username: '',
        password: '',
      },

      confirmPassword: ''
    }
  },
  created () {
  },
  watch: {
    'form.username': function () {
      this.form.username = this.form.username.toLowerCase()
    },
  },
  methods: {
    apply () {
      console.log(this.form)
      let param = {
        username: this.form.username,
        email: this.form.email,
        password: this.form.password,
      }
      if (this.$refs.form.validate()) {
        axiosTool.post('applyAccount', param).then((res) => {
          console.log(res)
          if (res == 'ok') {
            this.tips('success', this.$vuetify.lang.t('$vuetify.userconfig.applicationSuccess'))
          } else {
            this.tips('error', this.$vuetify.lang.t('$vuetify.userconfig.applicationFailed'))
          }
        })
      }
    },
    tips (color, msg) {
      this.color = color
      this.msg = msg
      this.msgSnackbar = true

    },

    // }
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
