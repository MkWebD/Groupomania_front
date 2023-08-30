<template>
	<v-app>
		<v-main>
			<NavBar />
			<router-view />
		</v-main>
	</v-app>
</template>

<script setup lang="ts">
import "../src/assets/styles/global.scss";
import NavBar from "./components/NavBar.vue";
</script>

<style scoped></style>
