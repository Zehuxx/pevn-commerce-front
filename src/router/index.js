import Vue from 'vue'
import VueRouter from 'vue-router'
import commerces from '../views/commerces.vue'
import createCommerce from '../views/createCommerce.vue'
import updateCommerce from '../views/updateCommerce.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/commerces',
    name: 'commerces',
    component: commerces
}, {
    path: '/commerces/create',
    name: 'createCommerce',
    component: createCommerce
}, {
    path: '/commerces/update/:id',
    name: 'updateCommerce',
    component: updateCommerce
}]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router