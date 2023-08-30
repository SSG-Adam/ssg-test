<template>
    <div class="lp-container">
        <form name="login-form" :class="{ 'dark-mode': isDarkMode }">
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
    </div>
</template>

<script lang="ts">
import router from '@/router';
import axios from 'axios';
import { useStore } from '@/store';
// import jwt_decode from 'jwt-decode';

const saveStorage = function (key: string, data: string) {
    sessionStorage.setItem(key, data);
}
const VITE_API_LINK = import.meta.env.VITE_API_LINK
export default {
    name: 'Login',
    data() {
        return {
            input: {
                email: "",
                password: ""
            },
            isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches
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
                const response = await axios.post(`${VITE_API_LINK}/auth/login`, {
                    email: this.input.email,
                    password: this.input.password
                });

                const authStore = useStore();
                authStore.setAccessToken(response.data.accessToken);

                const accessToken = response.data.accessToken;

                // Save to sessionStorage
                saveStorage('accessToken', accessToken);

                //Code used to find out the validity duration of the accessToken
                // const decodedToken: any = jwt_decode(accessToken);
                // console.log(decodedToken, "accessToken validity duration");

                router.push({ name: 'ListsPage' });
            } catch (error) {
                console.log(error);
            }
        },
    },
    beforeRouteEnter(to, from, next) {
        const authStore = useStore();
        if (authStore.accessToken) {
            next({ name: 'ListsPage' });
        } else {
            next();
        }
    }
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
    &.dark-mode {
        color: white;
        background-color: white;
        border-radius: 10px;
        h1,label {
            color: black;
        }
    }

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