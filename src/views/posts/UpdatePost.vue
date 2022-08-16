<template>
    <v-container>
        <h1 class="text-center text-primary border-md rounded-shaped">Modify your post</h1>
        <v-form @submit="onSubmit">
            <div class="form-row">
                <v-text-field
                        v-model="title"
                        name="title"
                        type="text"
                        class="form-control mt-5"
                        counter="30"
                        hint="Number of characters :"
                        label="Post title"
                        variant="solo"
                        placeholder="Enter title of your post"
                        color="primary"
                        :error-messages="titleError"
                >
                </v-text-field>
                <v-textarea
                        v-model="content"
                        type="text"
                        class="form-control"
                        counter="3000"
                        hint="Number of characters :"
                        label="Content of post"
                        variant="solo"
                        placeholder="Write your content here"
                        auto-grow
                        color="primary"
                        :error-messages="contentError"
                >
                </v-textarea>
                <v-row class="d-flex align-center">
                    <v-col cols="8">
                <v-file-input
                        chips
                        v-model="image"
                        accept="image/*"
                        label="File input"
                        prepend-icon="mdi-camera"
                        color="primary"
                        clearable="true"
                        :error-messages="imageError"
                        type="file"
                        @change="preview()"
                        @click:clear="clearPreview()"
                >
                </v-file-input>
                    </v-col>
                    <v-col cols="4">
                        <v-card>
                        <v-img height="250" v-if="url" :src="url"></v-img>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row class="form-group">
                    <v-col cols="12" lg="3">
                        <v-btn type="submit" color="success">
                            Update Post
                        </v-btn>
                    </v-col>
                    <v-col cols="12" lg="3">
                        <v-btn @click="reset()" color="error">
                            Reset Form
                        </v-btn>
                    </v-col>
                    <v-col cols="12" lg="3">
                        <router-link :to="{name: 'home'}">
                            <v-btn tile>Go Back</v-btn>
                        </router-link>
                    </v-col>
                </v-row>
            </div>
        </v-form>
    </v-container>
</template>

<script setup>
    import {onMounted, ref} from 'vue'
    import {useRouter, useRoute} from "vue-router"
    import {useField, useForm} from 'vee-validate';
    import * as yup from 'yup';

    onMounted(() => {
        fetch(`${serverUrl}${id}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                Authorization: `token ${parsedStorage.token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                title.value = data.title
                content.value = data.content
                url.value = data.imageUrl
            })
            .catch(err => console.error(err.message))
    })

    const { handleSubmit, resetForm } = useForm();
    const router = useRouter()
    const route = useRoute()
    const serverUrl = "http://localhost:8080/api/post/"
    const id = route.params.id
    const parsedStorage = JSON.parse(localStorage.user)
    const url = ref(null)

    const preview = function() {
        const file = image.value[0];
        url.value = URL.createObjectURL(file);
    }

    const clearPreview = () => {
        url.value = null
    }

    const reset = () => {
        resetForm({
            values: {
                title: '',
                content: '',
                image: ''
            }
        })
        url.value = null
    }

    const onSubmit = handleSubmit(values => {
        const formData = new FormData;
        formData.append('title', values.title)
        formData.append('content', values.content)
        if (values.image) {
            formData.append('image', values.image[0])
        }

        fetch(`${serverUrl}${id}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                Authorization: `token ${parsedStorage.token}`
            },
            body: formData
        })
            .then(res => {
                if (res.status === 200) {
                    router.push({name: 'home'})
                }
            })
            .catch(err => console.error(err.message))
    })

    const {value: title, errorMessage: titleError} = useField('title',
        yup.string()
            .nullable()
            .required("You must enter a title")
            .min(3, "Title must have a minimum of 3 characters")
            .max(30, "Title must have a maximum of 30 characters"))

    const {value: content, errorMessage: contentError} = useField('content',
        yup.string()
            .nullable()
            .required("You must write a content")
            .min(5, "Content must have a minimum of 5 characters")
            .max(3000, "Content must have a minimum of 3000 characters")
    )

    const {value: image, errorMessage: imageError} = useField('image',
        yup.mixed()
    )
</script>

