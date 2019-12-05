<template>
  <div>
    <el-menu
      :default-active="$route.path"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#28323E"
      text-color="#ffffff"
      active-text-color="#139A19"
    >
      <el-menu-item index="/">
        <router-link to="/">
          <i class="el-icon-search"></i>
          <span>查询商品</span>
        </router-link>
      </el-menu-item>
      <el-menu-item index="/guige">
        <router-link to="/guige">
          <i class="el-icon-copy-document"></i>
          <span>规格参数</span>
        </router-link>
      </el-menu-item>
      <el-menu-item index="/fenlei">
        <router-link to="/fenlei">
          <i class="el-icon-postcard"></i>
          <span>内容分类管理</span>
        </router-link>
      </el-menu-item>
      <el-menu-item index v-if="nickname">
        <span>{{nickname}}</span>
        <el-button @click="goLogin">登出</el-button>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Nav",
  data() {
    return {
      activeIndex: "1",
      nickname: ""
    };
  },
  methods: {
    ...mapActions(["addUserAction", "addPassAction", "incrementAction"]),
    goLogin() {
      // console.log(this.username);
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      this.addUserAction({ data: "" });
      this.addUserAction({ data: "" });
      this.$router.push("/login");
    }
  },
  mounted() {
    this.nickname = this.$store.state.username;
  }
};
</script>

<style scoped>
li {
  width: 25%;
  font-size: 16px;
}
a {
  display: block;
}
</style>