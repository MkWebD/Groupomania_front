<template>
	<VeeForm v-slot="{ handleSubmit }" :validation-schema="submitPostSchema" as="div">
		<form v-if="isAddingPost" @submit="handleSubmit($event, onSendPost)">
			<article class="postcard light blue">
				<a class="postcard__img_link" @click="clickFileInput" :class="{ unInputtedImage: !inputtedImage }">
					<div class="postcard__img--subtitle" v-if="!inputtedImage">
						Click the image to change it (required)
						<div :class="{ 'is-invalid': imageError }">{{ imageError }}</div>
					</div>
					<Field name="image"
						><input
							ref="fileInputRef"
							class="hidden-input"
							type="file"
							clearable="true"
							accept="image/*"
							@change="handleFileChange"
					/></Field>
					<img
						class="postcard__img create__img"
						alt="Image Title"
						:src="previewImageUrl"
						:class="{ 'is-invalid': imageError }"
					/>
				</a>

				<div class="postcard__text t-dark">
					<h1 class="postcard__title blue">
						<Field
							v-model="title"
							name="title"
							type="text"
							placeholder="Post title"
							class="postcard__title--input"
							:class="{ 'is-invalid': titleError }"
						/>
						<div class="postcard__title--subtitle" :class="{ 'is-invalid': titleError }">
							Number of characters : {{ title?.length }} / 30 (min 3)
						</div>
					</h1>
					<div class="postcard__subtitle small">
						<time datetime="2020-05-25 12:00:00">
							<font-awesome-icon :icon="['fas', 'calendar']" class="postcard__subtitle--icon" />
							Creation date : {{ new Date().toDateString() }}
						</time>
					</div>
					<div class="postcard__bar"></div>
					<div class="postcard__preview-txt">
						<Field
							v-model="content"
							name="content"
							type="textarea"
							placeholder="Write your content here"
							class="postcard__preview--input"
							:class="{ 'is-invalid': contentError }"
						></Field>
						<div class="postcard__title--subtitle" :class="{ 'is-invalid': contentError }">
							Number of characters : {{ content?.length }} / 3000 (min 5)
						</div>
					</div>
					<ul class="postcard__tagbox">
						<li class="tag__item play blue" :class="{ submit: isAddingPost }">
							<button class="tag__item--link link__submit">
								<font-awesome-icon :icon="['fas', 'paper-plane']" class="postcard__tagbox--icon" />Submit your post
							</button>
						</li>
						<li class="tag__item play blue reset" :class="{ submit: isAddingPost }">
							<button class="tag__item--link link__reset" @click="reset()">
								<font-awesome-icon :icon="['fas', 'paper-plane']" class="postcard__tagbox--icon" />Reset Form
							</button>
						</li>
					</ul>
				</div>
			</article>
		</form>
	</VeeForm>
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
					<font-awesome-icon :icon="['fas', 'calendar']" class="postcard__subtitle--icon" />
					Last modified : {{ new Date(post.date).toDateString() }}
				</time>
			</div>
			<div class="postcard__bar"></div>
			<div class="postcard__preview-txt">
				{{ post.content }}
			</div>
			<ul class="postcard__tagbox">
				<li class="tag__item play positive" :class="{ 'has-likes': post.likes > 0 }" @click.stop="likePost(post._id)">
					<a class="tag__item--link"
						><font-awesome-icon :icon="['fas', 'thumbs-up']" class="postcard__tagbox--icon" />Total likes :
						{{ post.likes }}</a
					>
				</li>
				<li
					class="tag__item play negative"
					:class="{ 'has-dislikes': post.dislikes > 0 }"
					@click.stop="dislikePost(post._id)"
				>
					<a class="tag__item--link"
						><font-awesome-icon :icon="['fas', 'thumbs-down']" class="postcard__tagbox--icon" />Total dislikes :
						{{ post.dislikes }}</a
					>
				</li>
				<li class="tag__item play">
					<a class="tag__item--link"
						><font-awesome-icon :icon="['fas', 'pen-to-square']" class="postcard__tagbox--icon" />Modify post</a
					>
				</li>
				<li class="tag__item play" @click.stop="showConfirmationDialog(post._id)" v-if="userId === post.userId">
					<a class="tag__item--link"
						><font-awesome-icon :icon="['fas', 'trash']" class="postcard__tagbox--icon" />Delete post</a
					>
				</li>
			</ul>
		</div>
	</article>
	<ConfirmationPopup
		v-if="showDialog"
		message="Are you sure you want to delete this post?"
		:onConfirm="deleteConfirmed"
		:onCancel="cancelDelete"
	/>
</template>

<script setup lang="ts">
import { Field, Form as VeeForm, useField } from "vee-validate";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import * as yup from "yup";
import placeholderImage from "../assets/images/placeholder-image.png";
import ConfirmationPopup from "./ConfirmationPopup.vue";
import "./PostCard.scss";
import { PostCallback, type PostObject } from "./types";

const router = useRouter();

const serverUrl = "https://server.kevinmas.com/groupomania/api/post/";
const { userId, token } = JSON.parse(localStorage.user);
const previewImageUrl = ref<string>(placeholderImage);
const fileInputRef = ref<HTMLInputElement | null>(null);
const inputtedImage = ref<boolean>(false);
const posts = ref<PostObject[]>([]);
const like = ref(0);
const showDialog = ref(false);
const postIdToDelete = ref<string | null>(null);
const requestOptions: { method: string; mode: "cors"; headers: { Authorization: string } } = {
	method: "GET",
	mode: "cors",
	headers: {
		Authorization: `token ${token}`,
	},
};
const { value: title, errorMessage: titleError } = useField("title", yup.string().min(3).max(30));
const { value: content, errorMessage: contentError } = useField("content", yup.string().min(5).max(3000));
const { value: image } = useField("image", yup.mixed());
const imageError = ref<string>("");
const submitPostSchema = yup.object({
	title: yup.string().min(3).max(30),
	content: yup.string().min(5).max(3000),
});

const showConfirmationDialog = (postId: string) => {
	showDialog.value = true;
	postIdToDelete.value = postId;
};

const deleteConfirmed = () => {
	if (postIdToDelete.value) {
		deletePost(postIdToDelete.value);
		postIdToDelete.value = null; // Reset postIdToDelete
	}
	showDialog.value = false; // Hide the dialog
};

const cancelDelete = () => {
	showDialog.value = false; // Hide the dialog
	postIdToDelete.value = null; // Reset postIdToDelete
};

defineProps<{ isAddingPost: boolean }>();

onMounted(() => {
	fetch(serverUrl, requestOptions)
		.then((res) => {
			if (res.ok) {
				return res.json();
			}
		})
		.then((data: PostObject[]) => (posts.value = data))
		.catch((err) => console.error(err.message));
});

const handleFileChange = (event: Event) => {
	const fileInput = event.target as HTMLInputElement;
	const file = fileInput.files?.[0];

	if (file) {
		const reader = new FileReader();
		reader.onload = () => {
			image.value = [file];
			previewImageUrl.value = reader.result as string;
			inputtedImage.value = true;
		};
		reader.readAsDataURL(file);
	}
};
const clickFileInput = () => {
	const fileInput = fileInputRef.value;
	if (fileInput) {
		fileInput.click();
	}
};

const reset = () => {
	title.value = "";
	content.value = "";
	previewImageUrl.value = placeholderImage;
	inputtedImage.value = false;
	fileInputRef.value = null;
	image.value = undefined;
	imageError.value = "";
};

const onSendPost = (values: unknown) => {
	imageError.value = "";
	const formValues = values as { title: string; content: string; image: File[] };
	console.log(values);
	if (!image.value) {
		imageError.value = "Image is required";
		return;
	} else {
		const formData = new FormData();
		formData.append("title", formValues.title);
		formData.append("content", formValues.content);
		formData.append("userId", userId);
		formData.append("image", image.value[0]);

		fetch(serverUrl, {
			method: "POST",
			mode: "cors",
			headers: {
				Authorization: `token ${token}`,
			},
			body: formData,
		})
			.then((res) => {
				if (res.status === 201) {
					router.push({ path: "/" });
					router.go(0);
				}
			})
			.catch((err) => console.error(err.message));
	}
};

const callFetch = (
	url: string,
	options: { method: string; mode: "cors"; headers: { Authorization: string } },
	cb: PostCallback
) => {
	return fetch(url, options)
		.then((res) => {
			if (res.ok) {
				return res.json();
			}
		})
		.then((data: PostObject) => cb(data))
		.catch((err) => console.error(err.message));
};

const deleteOptions: { method: string; mode: "cors"; headers: { Authorization: string } } = {
	method: "DELETE",
	mode: "cors",
	headers: {
		Authorization: `token ${token}`,
	},
};

const deletePost = (id: string) => {
	console.log(id);
	callFetch(`${serverUrl}/${id}`, deleteOptions, () => {
		router.push({ path: "/" });
		router.go(0);
	});
};

const likePost = (id: string) => {
	let likeValue = {};
	const likeObject = () => {
		switch (like.value) {
			case 0:
				like.value = 1;
				return (likeValue = {
					like: 1,
					userId: userId,
				});
			case 1:
				like.value = 0;
				return (likeValue = {
					like: 0,
					userId: userId,
				});
		}
	};

	likeObject();

	const likeOptions: {
		method: string;
		mode: "cors";
		headers: { "Content-Type": string; Authorization: string };
		body: string;
	} = {
		method: "POST",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
			Authorization: `token ${token}`,
		},
		body: JSON.stringify(likeValue),
	};

	callFetch(`${serverUrl}${id}/like`, likeOptions, () => {
		getData(id);
	});
};

const dislikePost = (id: string) => {
	let dislikeValue = {};
	const dislikeObject = () => {
		switch (like.value) {
			case 0:
				like.value = -1;
				return (dislikeValue = {
					like: -1,
					userId: userId,
				});
			case -1:
				like.value = 0;
				return (dislikeValue = {
					like: 0,
					userId: userId,
				});
		}
	};

	dislikeObject();

	const dislikeOptions: {
		method: string;
		mode: "cors";
		headers: { "Content-Type": string; Authorization: string };
		body: string;
	} = {
		method: "POST",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
			Authorization: `token ${token}`,
		},
		body: JSON.stringify(dislikeValue),
	};

	callFetch(`${serverUrl}${id}/like`, dislikeOptions, () => {
		getData(id);
	});
};

const getOptions: { method: string; mode: "cors"; headers: { Authorization: string } } = {
	method: "GET",
	mode: "cors",
	headers: {
		Authorization: `token ${token}`,
	},
};

const getData = (id?: string) => {
	callFetch(`${serverUrl}${id}`, getOptions, (data) => {
		const postIndex = posts.value.findIndex((post) => post._id === data._id);
		posts.value[postIndex] = data;
	});
};
</script>
