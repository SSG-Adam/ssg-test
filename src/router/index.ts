import { createWebHistory, createRouter } from "vue-router";
import { useStore } from "@/store";

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
        path: "/",
        name: 'ListsPage',
        component: () => import('../components/ListsPage.vue'),
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
    linkActiveClass: 'active'
});

router.beforeEach((to, from, next) =>{
    const authStore = useStore();
    if(to.meta.requiresAuth && !authStore.accessToken) {
        next({ name: 'Login' });
    } else {
        next();
    }
});

export default router;
