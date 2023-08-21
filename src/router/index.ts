import { type Router,createWebHistory, createRouter } from "vue-router";
const routes  = [
    {
        path: "/login",
        name: 'Login',
        component: () => import('../components/LoginPage.vue')
    },
    {
        path: "/register",
        name: 'Register',
        component: () => import('../components/RegistrationPage.vue')
    },
    {
        path: "/lists-page",
        name: 'ListsPage',
        component: () => import('../components/ListsPage.vue')
    }
]

const router:Router = createRouter({
    history: createWebHistory(),
    routes: routes,
    linkActiveClass: 'active'
});

export default router;
