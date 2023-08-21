import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: '',
    }),
    actions: {
        setAccessToken(token: string) {
            this.accessToken = token;
        }
    }
})