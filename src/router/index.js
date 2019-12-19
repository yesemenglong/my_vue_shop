import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login'
import Home from '../components/home'
import Welcome from '../components/welcome'
import Users from '../components/user/users'
import Rights from '../components/power/rights'
import Roles from '../components/power/roles'
import Cate from '../components/goods/cate'
import Params from '../components/goods/params'
import GoodsList from '../components/goods/list'
import Add from '../components/goods/add'
import Order from '../components/order/order'
import Report from '../components/report/report'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/welcome',
    children: [
        {
            path: '/welcome',
            component: Welcome,
        },
        {
            path: '/users',
            component: Users
        },
        {
            path: '/rights',
            component: Rights
        },
        {
            path: '/roles',
            component: Roles
        },
        {
            path: '/categories',
            component: Cate
        },
        {
            path: '/params',
            component: Params
        },
        {
            path: '/goods',
            component: GoodsList
        },
        {
            path: '/goods/add',
            component: Add
        },
        {
            path: '/orders',
            component: Order
        },
        {
            path: '/reports',
            component: Report
        },
    ]
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转
  if(to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})

export default router
