import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../views/Login/Login.vue"
import Fenlei from "../views/Fenlei/Fenlei.vue"
import Guige from "../views/Guige/Guige.vue"
import SearchProduct from "../views/SearchProduct/SearchProduct.vue"
import Mynav from "../views/Mynav/Mynav.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Mynav',
    component: Mynav,
    children: [
      {
        path: "",
        name: "SearchProduct",
        component: SearchProduct,
        meta:{
          islogin:true
        }
      },
      {
        path: "guige",
        name: "Guige",
        component: Guige,
        meta:{
          islogin:true
        }
      },
      {
        path: "fenlei",
        name: "Fenlei",
        component: Fenlei,
        meta:{
          islogin:true
        }
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  }
]

const router = new VueRouter({
  mode: "history",
  routes
})

router.beforeEach((to,from,next)=>{
  // console.log(to,from); 
  if(to.meta.islogin){
    let locauser=localStorage.getItem("username");
    if(locauser){
      next();
    }else{
      next("/login")
    }
  }else{
    next();
  }
})

export default router
