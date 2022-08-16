<template>
    <v-app>
        <v-main>
            <NavBar/>
            <router-view/>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
    import NavBar from "./components/NavBar.vue"
    import '../src/assets/styles/global.scss'
</script>

<style scoped>
</style>