<template>
	<article class="postcard light blue" v-for="post in posts" :key="post._id">
		<a class="postcard__img_link" :href="post._id">
			<img class="postcard__img" :src="post.imageUrl" alt="Image Title" />
		</a>

		<div class="postcard__text t-dark">
			<h1 class="postcard__title blue">
				<a :href="post._id">{{ post.title }}</a>
			</h1>
			<div class="postcard__subtitle small">
				<time datetime="2020-05-25 12:00:00">
					<i class="fas fa-calendar-alt mr-2"></i>Last modified : {{ new Date(post.date).toDateString() }}
				</time>
			</div>
			<div class="postcard__bar"></div>
			<div class="postcard__preview-txt">
				{{ post.content }}
			</div>
			<ul class="postcard__tagbox">
				<li class="tag__item play blue">
					<a :href="post._id"><i class="fas fa-play mr-2"></i>Read more ...</a>
				</li>
			</ul>
		</div>
	</article>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import "./PostCard.scss";

interface post {
	_id: string;
	title: string;
	content: string;
	date: string;
	imageUrl: string;
	userId: string;
}

const posts = ref<post[]>([]);

const serverUrl = "https://server.kevinmas.com/groupomania/api/post/";
const parsedStorage = JSON.parse(localStorage.user);
const requestOptions: { method: string; mode: "cors"; headers: { Authorization: string } } = {
	method: "GET",
	mode: "cors",
	headers: {
		Authorization: `token ${parsedStorage.token}`,
	},
};

onMounted(() => {
	fetch(serverUrl, requestOptions)
		.then((res) => {
			if (res.ok) {
				return res.json();
			}
		})
		.then((data) => (posts.value = data))
		.catch((err) => console.error(err.message));
});
</script>
