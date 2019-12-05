<template>
  <div id="login">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="账号">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {mapActions} from "vuex";
export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
      ...mapActions(["addUserAction","addPassAction"]),
    onSubmit() {
    //   console.log(this);
      this.axios.post("/api/user", this.form).then(data => {
        // console.log(data);
        if (data.data.code === "1") {
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("username", data.data.username);
          this.addPassAction({data:data.data.token});
          this.addUserAction({data:data.data.username});
          this.$router.push("/");
        } else {
          this.$message({
            message: data.data.msg,
            type: "error"
          });
        }
      });
    }
  }
};
</script>

<style scoped>
#login {
  width: 600px;
  margin: 50px auto;
}
</style>