<template>
  <div id="mynav">
    <div class="mynav">
      <div class="mynav-box">
        <div class="mynav-log">Ego商城后台系统</div>
        <div class="mynav-nav">
          <Nav />
        </div>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import Nav from "../../components/Nav/Nav";
export default {
  name: "Mynav",
  data() {
    return {};
  },
  components: {
    Nav
  }
};
</script>

<style scoped>
#mynav {
  width: 100%;
}
.mynav {
  background-color: #28323e;
  height: 60px;
}
.mynav-box {
  width: 90%;
  margin: 0 auto;
  display: flex;
}
.mynav-log {
  width: 250px;
  font-size: 24px;
  line-height: 60px;
  color: #ffffff;
}
.mynav-nav {
  flex-grow: 1;
}
</style>