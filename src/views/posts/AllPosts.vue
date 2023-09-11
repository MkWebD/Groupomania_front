<template>
	<div class="posts main-bg">
		<div class="posts__container">
			<div class="posts__header">
				<h1 class="posts__header--title">Most recent posts</h1>
				<div class="posts__header--menu">
					<button class="posts__button" @click="toggleIsAddingPost">{{ buttonText }}</button>
				</div>
			</div>
			<PostCard :isAddingPost="isAddingPost" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import PostCard from "../../components/PostCard.vue";
import "./AllPosts.scss";
const isAddingPost = ref<boolean>(false);

const toggleIsAddingPost = () => {
	isAddingPost.value = !isAddingPost.value;
};

const buttonText = computed(() => {
	return isAddingPost.value ? "Close add Form" : "Add a new post";
});
</script>
