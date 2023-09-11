<template>
	<VeeForm v-slot="{ handleSubmit }" :validation-schema="submitPostSchema" as="div">
		<form v-if="isAddingPost" @submit="handleSubmit($event, createPost)">
			<article class="postcard light blue">
				<a
					class="postcard__img_link"
					@click="clickFileInput"
					:class="{ unInputtedImage: !hasInputtedImageForCreation }"
				>
					<div class="postcard__img--subtitle" v-if="!hasInputtedImageForCreation">
						Click the image to change it (required)
						<div :class="{ 'is-invalid': imageError }">{{ imageError }}</div>
					</div>
					<Field name="image"
						><input
							ref="fileInputRefForCreation"
							class="hidden-input"
							type="file"
							clearable="true"
							accept="image/*"
							data-type="creation"
							@change="handleFileChange"
					/></Field>
					<img
						class="postcard__img create__img"
						alt="Image Title"
						:src="previewImageUrlForCreation"
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
						<li class="tag__item play blue submit">
							<button class="tag__item--link">
								<font-awesome-icon :icon="['fas', 'paper-plane']" class="postcard__tagbox--icon" />Submit your post
							</button>
						</li>
						<li class="tag__item play blue warning">
							<button class="tag__item--link" @click="reset()">
								<font-awesome-icon :icon="['fas', 'ban']" class="postcard__tagbox--icon" />Reset Form
							</button>
						</li>
					</ul>
				</div>
			</article>
		</form>
	</VeeForm>
	<VeeForm v-slot="{ handleSubmit }" :validation-schema="submitUpdateSchema" as="div">
		<form @submit="handleSubmit($event, updatePost)">
			<article class="postcard light blue" v-for="post in posts" :key="post._id">
				<a
					class="postcard__img_link"
					:class="{ unInputtedImage: editingPostId === post._id }"
					@click="clickUpdateFileInput"
				>
					<div class="postcard__img--subtitle" v-if="editingPostId === post._id">
						Click the image if you want to change it
						<div :class="{ 'is-invalid': imageError }">{{ imageError }}</div>
					</div>
					<Field name="updateImage" v-if="editingPostId === post._id"
						><input
							ref="fileInputRefForUpdate"
							class="hidden-input"
							type="file"
							clearable="true"
							accept="image/*"
							data-type="update"
							@change="handleFileChange"
					/></Field>
					<img
						v-if="editingPostId === post._id && hasInputtedImageForUpdate"
						class="postcard__img create__img"
						alt="Image Title"
						:src="previewImageUrlForUpdate"
						:class="{ 'is-invalid': updateImageError }"
					/>

					<img
						class="postcard__img"
						:src="post.imageUrl"
						alt="Image Title"
						v-if="!hasInputtedImageForUpdate && editingPostId === post._id"
					/>
					<img class="postcard__img" :src="post.imageUrl" alt="Image Title" v-if="editingPostId !== post._id" />
				</a>

				<div class="postcard__text t-dark">
					<h1 class="postcard__title blue">
						<a v-if="editingPostId !== post._id">{{ post.title }}</a>
						<Field
							v-if="editingPostId === post._id"
							v-model="updateTitle"
							name="updateTitle"
							type="text"
							placeholder="Post title"
							class="postcard__title--input"
							:class="{ 'is-invalid': updateTitleError }"
						/>
						<div
							class="postcard__title--subtitle"
							:class="{ 'is-invalid': updateTitleError }"
							v-if="editingPostId === post._id"
						>
							Number of characters : {{ updateTitle?.length }} / 30 (min 3)
						</div>
					</h1>
					<div class="postcard__subtitle small">
						<time datetime="2020-05-25 12:00:00">
							<font-awesome-icon :icon="['fas', 'calendar']" class="postcard__subtitle--icon" />
							Last modified : {{ new Date(post.date).toDateString() }}
						</time>
					</div>
					<div class="postcard__bar"></div>
					<div class="postcard__preview-txt" v-if="editingPostId !== post._id">
						{{ post.content }}
					</div>
					<div class="postcard__preview-txt" v-if="editingPostId === post._id">
						<Field
							v-model="updateContent"
							name="updateContent"
							type="textarea"
							placeholder="Write your content here"
							class="postcard__preview--input"
							:class="{ 'is-invalid': updateContentError }"
						></Field>
						<div
							class="postcard__title--subtitle"
							:class="{ 'is-invalid': updateContentError }"
							v-if="editingPostId === post._id"
						>
							Number of characters : {{ updateContent?.length }} / 3000 (min 5)
						</div>
					</div>

					<ul class="postcard__tagbox">
						<li
							class="tag__item positive"
							:class="{ 'has-likes': post.likes > 0 }"
							@click.stop="likePost(post._id, post.usersDisliked)"
							v-if="editingPostId !== post._id"
						>
							<button type="button" class="tag__item--link positive__link">
								<font-awesome-icon :icon="['fas', 'thumbs-up']" class="postcard__tagbox--icon" />Total likes :
								{{ post.likes }}
							</button>
						</li>
						<li
							class="tag__item negative"
							:class="{ 'has-dislikes': post.dislikes > 0 }"
							@click.stop="dislikePost(post._id, post.usersLiked)"
							v-if="editingPostId !== post._id"
						>
							<button class="tag__item--link negative__link">
								<font-awesome-icon :icon="['fas', 'thumbs-down']" class="postcard__tagbox--icon" />Total dislikes :
								{{ post.dislikes }}
							</button>
						</li>
						<li
							class="tag__item play submit"
							@click.stop="openUpdatePostDialog(post._id)"
							v-if="userId === post.userId && editingPostId !== post._id"
						>
							<button class="tag__item--link">
								<font-awesome-icon :icon="['fas', 'pen-to-square']" class="postcard__tagbox--icon" />Modify post
							</button>
						</li>
						<li class="tag__item submit" v-if="editingPostId === post._id">
							<button class="tag__item--link">
								<font-awesome-icon :icon="['fas', 'share']" class="postcard__tagbox--icon" />Submit update
							</button>
						</li>
						<li
							class="tag__item play warning"
							@click.stop="cancelUpdatePostDialog()"
							v-if="userId === post.userId && editingPostId === post._id"
						>
							<button class="tag__item--link">
								<font-awesome-icon :icon="['fas', 'ban']" class="postcard__tagbox--icon" />Cancel update
							</button>
						</li>
						<li
							class="tag__item play warning"
							@click.stop="showConfirmationDialog(post._id)"
							v-if="userId === post.userId && editingPostId !== post._id"
						>
							<button type="button" class="tag__item--link">
								<font-awesome-icon :icon="['fas', 'trash']" class="postcard__tagbox--icon" />Delete post
							</button>
						</li>
					</ul>
				</div>
			</article>
		</form>
	</VeeForm>
	<ConfirmationPopup
		v-if="displayDeleteConfirmation"
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
import { callFetch } from "../utils/helpers";
import ConfirmationPopup from "./ConfirmationPopup.vue";
import "./PostCard.scss";
import { type PostObject } from "./types";

const router = useRouter();

const serverUrl = "https://server.kevinmas.com/groupomania/api/post";
const { userId, token } = JSON.parse(localStorage.user);
const previewImageUrlForCreation = ref<string>(placeholderImage);
const previewImageUrlForUpdate = ref<string>("");
const fileInputRefForCreation = ref<HTMLInputElement | null>(null);
const fileInputRefForUpdate = ref<HTMLInputElement[] | null>(null);
const hasInputtedImageForCreation = ref<boolean>(false);
const hasInputtedImageForUpdate = ref<boolean>(false);
const posts = ref<PostObject[]>([]);
const like = ref(0);
const displayDeleteConfirmation = ref(false);
const editedPostDataBeforeUpdate = ref({ title: "", content: "" });
const postIdToDelete = ref<string | null>(null);
const editingPostId = ref<string | null>(null);

const { value: title, errorMessage: titleError } = useField("title", yup.string().min(3).max(30));
const { value: updateTitle, errorMessage: updateTitleError } = useField("updateTitle", yup.string().min(3).max(30));
const { value: content, errorMessage: contentError } = useField("content", yup.string().min(5).max(3000));
const { value: updateContent, errorMessage: updateContentError } = useField(
	"updateContent",
	yup.string().min(5).max(3000)
);
const { value: image } = useField("image", yup.mixed());
const { value: updateImage } = useField("updateImage", yup.mixed());
const imageError = ref<string>("");
const updateImageError = ref<string>("");
const submitPostSchema = yup.object({
	title: yup.string().min(3).max(30),
	content: yup.string().min(5).max(3000),
});
const submitUpdateSchema = yup.object({
	updateTitle: yup.string().min(3).max(30),
	updateContent: yup.string().min(5).max(3000),
});

defineProps<{ isAddingPost: boolean }>();

onMounted(() => {
	callFetch<PostObject[]>(
		serverUrl,
		{
			method: "GET",
			mode: "cors",
			headers: {
				Authorization: `token ${token}`,
			},
		},
		(data) => {
			posts.value = data;
		}
	);
});

//CRUD Functions

const createPost = (values: unknown) => {
	imageError.value = "";
	const formValues = values as { title: string; content: string; image: File[] };
	if (!image.value) {
		imageError.value = "Image is required";
		return;
	} else {
		const formData = new FormData();
		formData.append("title", formValues.title);
		formData.append("content", formValues.content);
		formData.append("userId", userId);
		formData.append("image", image.value[0]);

		callFetch(
			serverUrl,
			{
				method: "POST",
				mode: "cors",
				headers: {
					Authorization: `token ${token}`,
				},
				body: formData,
			},
			() => {
				router.push({ path: "/" });
				router.go(0);
			}
		);
	}
};

const readPost = (id?: string) => {
	callFetch<PostObject>(
		`${serverUrl}/${id}`,
		{
			method: "GET",
			mode: "cors",
			headers: {
				Authorization: `token ${token}`,
			},
		},
		(data) => {
			const postIndex = posts.value.findIndex((post) => post._id === data._id);
			posts.value[postIndex] = data;
		}
	);
};

const updatePost = (values: unknown) => {
	const formValues = values as { updateTitle: string; updateContent: string; updateImage: File[] };
	const formData = new FormData();
	formData.append("title", formValues.updateTitle);
	formData.append("content", formValues.updateContent);
	if (updateImage.value) {
		formData.append("image", updateImage.value[0]);
	}

	callFetch<PostObject>(
		`${serverUrl}/${editingPostId.value}`,
		{
			method: "PUT",
			mode: "cors",
			headers: {
				Authorization: `token ${token}`,
			},
			body: formData,
		},
		() => {
			router.push({ path: "/" });
			router.go(0);
		}
	);
};

const deletePost = (id: string) => {
	callFetch(
		`${serverUrl}/${id}`,
		{
			method: "DELETE",
			mode: "cors",
			headers: {
				Authorization: `token ${token}`,
			},
		},
		() => {
			router.push({ path: "/" });
			router.go(0);
		}
	);
};

const likePost = (id: string, usersDisliked: string[]) => {
	const editedPost = posts.value.find((post) => post._id === id) as PostObject;
	const hasLike = editedPost.usersLiked.includes(userId);
	if (usersDisliked.includes(userId)) {
		return;
	}
	let likeValue = {};
	const likeObject = () => {
		switch (hasLike) {
			case true:
				return (likeValue = {
					like: 0,
					userId,
				});
			case false:
				return (likeValue = {
					like: 1,
					userId,
				});
		}
	};

	likeObject();

	callFetch(
		`${serverUrl}/${id}/like`,
		{
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
				Authorization: `token ${token}`,
			},
			body: JSON.stringify(likeValue),
		},
		() => {
			readPost(id);
		}
	);
};

const dislikePost = (id: string, usersLiked: string[]) => {
	const editedPost = posts.value.find((post) => post._id === id) as PostObject;
	const hasDislike = editedPost.usersDisliked.includes(userId);
	if (usersLiked.includes(userId)) {
		return;
	}
	let dislikeValue = {};
	const dislikeObject = () => {
		switch (hasDislike) {
			case true:
				return (dislikeValue = {
					like: 0,
					userId,
				});
			case false:
				return (dislikeValue = {
					like: -1,
					userId,
				});
		}
	};

	dislikeObject();

	callFetch(
		`${serverUrl}/${id}/like`,
		{
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
				Authorization: `token ${token}`,
			},
			body: JSON.stringify(dislikeValue),
		},
		() => {
			readPost(id);
		}
	);
};

//POPUP Functions

const showConfirmationDialog = (postId: string) => {
	displayDeleteConfirmation.value = true;
	postIdToDelete.value = postId;
};

const deleteConfirmed = () => {
	if (postIdToDelete.value) {
		deletePost(postIdToDelete.value);
		postIdToDelete.value = null;
	}
	displayDeleteConfirmation.value = false;
};

const cancelDelete = () => {
	displayDeleteConfirmation.value = false;
	postIdToDelete.value = null;
};

//FILE INPUT Functions

const handleFileChange = (event: Event) => {
	const fileInput = event.target as HTMLInputElement;
	const typeOfInput = fileInput.dataset.type;
	const file = fileInput.files?.[0];

	if (file) {
		const reader = new FileReader();
		reader.onload = () => {
			switch (typeOfInput) {
				case "creation":
					image.value = [file];
					previewImageUrlForCreation.value = reader.result as string;
					hasInputtedImageForCreation.value = true;
					break;
				case "update":
					updateImage.value = [file];
					previewImageUrlForUpdate.value = reader.result as string;
					hasInputtedImageForUpdate.value = true;
					break;
			}
		};
		reader.readAsDataURL(file);
	}
};

const clickFileInput = () => {
	const fileInput = fileInputRefForCreation.value;
	if (fileInput) {
		fileInput.click();
	}
};

const clickUpdateFileInput = () => {
	const fileInput = fileInputRefForUpdate.value ? fileInputRefForUpdate.value[0] : null;
	if (fileInput) {
		fileInput.click();
	}
};

//UPDATE DIALOG Functions

const openUpdatePostDialog = (id: string) => {
	editingPostId.value = id;
	const editedPost = posts.value.find((post) => post._id === id) as PostObject;
	updateTitle.value = editedPost.title;
	updateContent.value = editedPost.content;
	updateImage.value = undefined;
	hasInputtedImageForUpdate.value = false;
	editedPostDataBeforeUpdate.value = { title: editedPost.title, content: editedPost.content };
};

const cancelUpdatePostDialog = () => {
	const editedPostIndex = posts.value.findIndex((post) => post._id === editingPostId.value);
	posts.value[editedPostIndex].title = editedPostDataBeforeUpdate.value.title;
	posts.value[editedPostIndex].content = editedPostDataBeforeUpdate.value.content;
	updateImage.value = undefined;
	hasInputtedImageForUpdate.value = false;
	editingPostId.value = null;
};

//RESET FORM Function

const reset = () => {
	title.value = "";
	content.value = "";
	previewImageUrlForCreation.value = placeholderImage;
	hasInputtedImageForCreation.value = false;
	fileInputRefForCreation.value = null;
	image.value = undefined;
	imageError.value = "";
};
</script>
