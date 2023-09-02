<template>
	<div class="fill-height main-bg">
		<v-container class="postsContainer">
			<h1 class="text-center posts__header h1">Most recent posts</h1>
			<v-row class="mt-5 mb-5 justify-center">
				<router-link :to="{ name: 'postCreation' }">
					<v-btn class="posts__button">Add a new post</v-btn>
				</router-link>
			</v-row>

			<PostCard />
		</v-container>
	</div>
</template>

<script setup lang="ts">
import PostCard from "../../components/PostCard.vue";
import "./AllPosts.scss";
</script>
