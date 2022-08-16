<template>
    <v-app-bar class="bg-tertiary">
        <nav class="text-secondary d-flex w-100 justify-space-between">
            <div>
                <router-link v-if="loginStatus" to="/">Home</router-link>
                <span v-if="!loginStatus"><router-link to="/auth/sign_up">Sign-up</router-link> | </span>
                <span v-if="!loginStatus"><router-link to="/auth/log_in">Log-in</router-link></span>
            </div>
            <div>
                <router-link v-if="loginStatus" @click="logout" to="/auth/log_in">Log-out</router-link>
            </div>
        </nav>
    </v-app-bar>
</template>

<script setup lang="ts">
    // Importing required external resources
    import {computed} from 'vue'
    import {useStore} from 'vuex'

    // Creating environment variables
    const store = useStore()

    // Creating function for logout
    const logout = () => {
        store.dispatch('logout')
        window.localStorage.removeItem('user')
    }

    // Getting info from store on logged status
    const loginStatus = computed(() => store.getters.loginStatus)
</script>

<style>
    a {
        text-decoration: none;
    }

    a:visited {
        color: inherit;
    }

    a:hover {
        color: white;
    }
</style>