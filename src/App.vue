<template>
	<NavBar />
	<router-view />
</template>

<script setup lang="ts">
import "../src/assets/styles/global.scss";
import NavBar from "./components/NavBar.vue";
</script>

<style scoped></style>
