import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useStore } from '@/store'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const authStore = useStore();

const savedToken = sessionStorage.getItem('accessToken');
if(savedToken) {
    authStore.setAccessToken(savedToken);
}

app.mount('#app')
