<template>
    <section class="signup-container">
        <form class="signup-form-container" autocomplete="off" :class="{ 'dark-mode': isDarkMode }">
            <h1>Sign Up</h1>
            <div class="form-item">
                <label for="name">Name:</label>
                <input 
                    type="text" 
                    placeholder="name" 
                    id="name" 
                    v-model="name"
                    />
            </div>
            <div class="form-item">
                <label for="email">Email:</label>
                <input
                    type="text" 
                    placeholder="email"
                    id="email"
                    v-model="email"
                />
            </div>
            <div class="form-item">
                <label for="password">Password:</label>
                <input 
                    type="password"
                    placeholder="Password"
                    id="password"
                    v-model="password"
                />
            </div>
            <div class="form-item">
                <label for="confirmPassword">Confirm Password</label>
                <input 
                    type="password"
                    placeholder="Type password again"
                    id="confirmPassword"
                    v-model="cPassword"
                />
            </div>
            <div class="nav-buttons">
                <button type="submit" @click.prevent="register()">Submit</button>
                <button type="submit" @click.prevent="login()">Login Instead?</button>
            </div>
            <p v-if="errorMessage" class="errorMsg">{{ errorMessage }}</p>
        </form>
    </section>
</template>

<script lang="ts">
import router from '@/router';
import { useStore } from '@/store';
import axios from 'axios';

// const VITE_API_LINK = import.meta.env.VITE_API_LINK;
const VITE_API_LINK = import.meta.env.VITE_API_LINK

export default {
    data() {
        return {
            name: "",
            email: "",
            password: "",
            cPassword: "",
            errorMessage: "",
            isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches
        }
    },
    methods: {
        async register() {
            if((this.password === this.cPassword) !== null || ""){
                try {
                let result = await axios.post(`${VITE_API_LINK}/auth/register`, {
                    name: this.name,
                    email: this.email,
                    password: this.password
                });
                console.log('test', result)
                if(result.status == 201) {
                    alert('You have created a new account!');
                    this.$router.push({ name: 'Home' })
                } else {
                    console.log('Registration failed, check', this.name, this.email, this.password, this.cPassword);
                }
            } catch (e: any) {
                console.dir(e)
                const errorMsg = e.response.data.message[0]
                console.log(errorMsg,"show me this")
                this.errorMessage = errorMsg;
            }
            } else {
                console.error(`Your ${this.password} and ${this.cPassword} are not the same!`);
            }
        },
        async login() {
            await router.push({ name: 'Login' })
        }
    },
    beforeRouteEnter(to, from, next) {
        const authStore = useStore();
        if(authStore.accessToken) {
            next({ name: 'ListsPage' });
        } else {
            next();
        }
    }
}
</script>

<style scoped lang="scss">
.signup-container {
    max-width: 400px;
    margin: auto;
    border: 1px solid black;
    .signup-form-container {
        padding: 10px;
        margin: auto;
        &.dark-mode {
            color: white;
            background-color: white;
            h1, label {
                color: black;
            }
            .errorMsg {
                color: red;
                font-size: 12px;
                display: flex;
                justify-content: center;
                padding-top: 10px;
            }
        }
        .form-item {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            align-items: center;
            input {
                border: 1.5px solid lightgrey;
                padding: 5px;
            }
        }
        .nav-buttons {
            display: flex;
            justify-content: space-evenly;
            padding-top: 20px;
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
}
</style>