<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: "app",
  components: {},
  methods: {
    ...mapActions(['addUserAction','addPassAction'])
  },
  created () {
    // 读取本地数据
    let username = localStorage.getItem('username')
    let token = localStorage.getItem('token')
    // 把数据写入vuex
    this.addUserAction({
      data:username
    })
    this.addPassAction({data:token});
  }
};
</script>

<style>
</style>
