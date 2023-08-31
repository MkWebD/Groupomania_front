<template>
	<v-app-bar class="navBar">
		<nav class="nav">
			<div class="nav__subMenu">
				<router-link v-if="loginStatus" :to="homeLink" class="nav__subMenu--button">Home</router-link>
				<router-link v-if="loginStatus" @click="logout" class="nav__subMenu--button" :to="authLink"
					>Log-out</router-link
				>
			</div>
			<div class="nav__subMenu">
				<router-link v-if="!loginStatus" class="nav__subMenu--button" :to="authLink">Authentication</router-link>
			</div>
		</nav>
	</v-app-bar>
</template>

<script setup lang="ts">
// Importing required external resources
import { computed } from "vue";
import { useStore } from "vuex";
import "./NavBar.scss";

// Creating environment variables
const store = useStore();

const homeLink = "/";
const authLink = "/auth";

// Creating function for logout
const logout = () => {
	store.dispatch("logout");
	window.localStorage.removeItem("user");
};

// Getting info from store on logged status
const loginStatus = computed(() => store.getters.loginStatus);
</script>

<style></style>
