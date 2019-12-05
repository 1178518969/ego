import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username:"",
    password:"",
    category:{},
    // categoryName:""
    // activeIndexChange:"1"
  },
  mutations: {
    addUser(state,payload){
      state.username=payload.data
    },
    addPass(state,payload){
      state.password=payload.data
    },
    addCategory(state,payload){
      state.category=payload
    },
    /* addCategoryName(state,payload){
      state.categoryId=payload.categoryName
    }, */
    // increment(state,payload){
    //   state.activeIndexChange=payload
    // }
  },
  actions: {
    addUserAction(context,payload){
      context.commit("addUser",payload)
    },
    addPassAction(context,payload){
      context.commit("addPass",payload)
    },
    addCategoryAction(context,payload){
      context.commit("addCategory",payload)
    },
    /* addCategoryNameAction(context,payload){
      context.commit("addCategoryName",payload)
    } */
    // incrementAction(context,payload){
    //   context.commit("increment",payload)
    // }
  },
  modules: {
  }
})
