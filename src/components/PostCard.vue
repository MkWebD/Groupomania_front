<template>
	<v-col cols="12">
		<v-card class="mb-5" v-for="post in posts" :key="post._id" color="tertiary" theme="dark">
			<div class="d-flex flex-no-wrap justify-space-between">
				<div>
					<v-card-title class="text-h5">
						{{ post.title }}
					</v-card-title>

					<v-card-subtitle>Last modified : {{ new Date(post.date).toDateString() }}</v-card-subtitle>

					<v-card-actions>
						<router-link :to="{ name: 'post', params: { id: post._id } }" custom v-slot="{ navigate }">
							<v-btn @click="navigate" role="link" class="ml-2" variant="outlined" size="small"> EXPLORE </v-btn>
						</router-link>
					</v-card-actions>
				</div>

				<v-avatar class="ma-3" size="125" rounded="0">
					<v-img :src="post.imageUrl"></v-img>
				</v-avatar>
			</div>
		</v-card>
	</v-col>
	<article class="postcard light blue">
		<a class="postcard__img_link" href="#">
			<img class="postcard__img" src="https://picsum.photos/1000/1000" alt="Image Title" />
		</a>
		<div class="postcard__text t-dark">
			<h1 class="postcard__title blue"><a href="#">Podcast Title</a></h1>
			<div class="postcard__subtitle small">
				<time datetime="2020-05-25 12:00:00"> <i class="fas fa-calendar-alt mr-2"></i>Mon, May 25th 2020 </time>
			</div>
			<div class="postcard__bar"></div>
			<div class="postcard__preview-txt">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi, fugiat asperiores inventore beatae accusamus
				odit minima enim, commodi quia, doloribus eius! Ducimus nemo accusantium maiores velit corrupti tempora
				reiciendis molestiae repellat vero. Eveniet ipsam adipisci illo iusto quibusdam, sunt neque nulla unde ipsum
				dolores nobis enim quidem excepturi, illum quos!
			</div>
			<ul class="postcard__tagbox">
				<li class="tag__item"><i class="fas fa-tag mr-2"></i>Podcast</li>
				<li class="tag__item"><i class="fas fa-clock mr-2"></i>55 mins.</li>
				<li class="tag__item play blue">
					<a href="#"><i class="fas fa-play mr-2"></i>Play Episode</a>
				</li>
			</ul>
		</div>
	</article>
	<article class="postcard light red">
		<a class="postcard__img_link" href="#">
			<img class="postcard__img" src="https://picsum.photos/501/500" alt="Image Title" />
		</a>
		<div class="postcard__text t-dark">
			<h1 class="postcard__title red"><a href="#">Podcast Title</a></h1>
			<div class="postcard__subtitle small">
				<time datetime="2020-05-25 12:00:00"> <i class="fas fa-calendar-alt mr-2"></i>Mon, May 25th 2020 </time>
			</div>
			<div class="postcard__bar"></div>
			<div class="postcard__preview-txt">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi, fugiat asperiores inventore beatae accusamus
				odit minima enim, commodi quia, doloribus eius! Ducimus nemo accusantium maiores velit corrupti tempora
				reiciendis molestiae repellat vero. Eveniet ipsam adipisci illo iusto quibusdam, sunt neque nulla unde ipsum
				dolores nobis enim quidem excepturi, illum quos!
			</div>
			<ul class="postcard__tagbox">
				<li class="tag__item"><i class="fas fa-tag mr-2"></i>Podcast</li>
				<li class="tag__item"><i class="fas fa-clock mr-2"></i>55 mins.</li>
				<li class="tag__item play red">
					<a href="#"><i class="fas fa-play mr-2"></i>Play Episode</a>
				</li>
			</ul>
		</div>
	</article>
	<article class="postcard light green">
		<a class="postcard__img_link" href="#">
			<img class="postcard__img" src="https://picsum.photos/500/501" alt="Image Title" />
		</a>
		<div class="postcard__text t-dark">
			<h1 class="postcard__title green"><a href="#">Podcast Title</a></h1>
			<div class="postcard__subtitle small">
				<time datetime="2020-05-25 12:00:00"> <i class="fas fa-calendar-alt mr-2"></i>Mon, May 25th 2020 </time>
			</div>
			<div class="postcard__bar"></div>
			<div class="postcard__preview-txt">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi, fugiat asperiores inventore beatae accusamus
				odit minima enim, commodi quia, doloribus eius! Ducimus nemo accusantium maiores velit corrupti tempora
				reiciendis molestiae repellat vero. Eveniet ipsam adipisci illo iusto quibusdam, sunt neque nulla unde ipsum
				dolores nobis enim quidem excepturi, illum quos!
			</div>
			<ul class="postcard__tagbox">
				<li class="tag__item"><i class="fas fa-tag mr-2"></i>Podcast</li>
				<li class="tag__item"><i class="fas fa-clock mr-2"></i>55 mins.</li>
				<li class="tag__item play green">
					<a href="#"><i class="fas fa-play mr-2"></i>Play Episode</a>
				</li>
			</ul>
		</div>
	</article>
	<article class="postcard light yellow">
		<a class="postcard__img_link" href="#">
			<img class="postcard__img" src="https://picsum.photos/501/501" alt="Image Title" />
		</a>
		<div class="postcard__text t-dark">
			<h1 class="postcard__title yellow"><a href="#">Podcast Title</a></h1>
			<div class="postcard__subtitle small">
				<time datetime="2020-05-25 12:00:00"> <i class="fas fa-calendar-alt mr-2"></i>Mon, May 25th 2020 </time>
			</div>
			<div class="postcard__bar"></div>
			<div class="postcard__preview-txt">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi, fugiat asperiores inventore beatae accusamus
				odit minima enim, commodi quia, doloribus eius! Ducimus nemo accusantium maiores velit corrupti tempora
				reiciendis molestiae repellat vero. Eveniet ipsam adipisci illo iusto quibusdam, sunt neque nulla unde ipsum
				dolores nobis enim quidem excepturi, illum quos!
			</div>
			<ul class="postcard__tagbox">
				<li class="tag__item"><i class="fas fa-tag mr-2"></i>Podcast</li>
				<li class="tag__item"><i class="fas fa-clock mr-2"></i>55 mins.</li>
				<li class="tag__item play yellow">
					<a href="#"><i class="fas fa-play mr-2"></i>Play Episode</a>
				</li>
			</ul>
		</div>
	</article>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const posts = ref([]);

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
