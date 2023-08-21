<template>
    <form name="login-form">
        <h1>Login</h1>
        <div>
            <label for="email">Email:</label>
            <input type="text" id="email" v-model="input.email" />
        </div>
        <div>
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="input.password" />
        </div>
        <div class="nav-btn">
            <button type="submit" @click.prevent="login()">Login</button>
            <button type="submit" @click.prevent="register()">Register?</button>
        </div>
    </form>
</template>

<script lang="ts">
import router from '@/router';
import axios from 'axios';
import { useAuthStore } from '@/stores/loginState';

const saveStorage = function(key: string, data: string){
    sessionStorage.setItem(key, data);
}
const authStore = useAuthStore();

export default {
    name: 'Login',
    data() {
        return {
            input: {
                email: "",
                password: ""
            }
        }
    },
    methods: {
        async register() {
            await router.push({ name: 'Register' })
        },
        async login() {
            if (this.input.email === "" || this.input.password === "") {
                window.alert("Username and Password cannot be empty");
                return;
            }
            try {
                const response = await axios.post(`https://nestjs-dev.deploy.nl/auth/login`, {
                    email: this.input.email,
                    password: this.input.password
                });

                const authStore = useAuthStore();
                authStore.setAccessToken(response.data.accessToken);

                const accessToken = response.data.accessToken;
                
                // Save to sessionStorage
                saveStorage('accessToken', accessToken);
                
                // Save as a cookie
                document.cookie = `accessToken=${accessToken}`;

                // Set in Axios default headers
                axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

                router.push({ name: 'ListsPage' });
            } catch (error) {
                console.log(error);
            }
        },
    },
};
</script>

<style scoped lang="scss">
    form {
        width: 300px;
        margin: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        border: 1px solid black;
        padding: 20px;
        div {
            padding: 5px 0;
            display: flex;
            justify-content: space-between;
        }
        .nav-btn {
            padding-top: 20px;
            justify-content: space-evenly;
            button {
                border: none;
                padding: 14px;
                border-radius: 8px;
                &:hover {
                    color: white;
                    background-color: black;
                    transform: scale(1.2);
                }
            }
        }
    }
</style>