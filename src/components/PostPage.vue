<template>
    <v-container>
        <h1 class="text-center text-primary border-md rounded-shaped">{{post.title}}</h1>
        <v-container>
            <v-row class="d-flex align-center">
                <v-col cols="12" md="3">
                    <v-card class="d-flex justify-center">
                        <v-img max-height="200" max-width="250" :src="post.imageUrl"></v-img>
                    </v-card>
                </v-col>
                <v-col cols="12" md="9">
                    <v-col cols="12" md="6" class="d-flex align-center">
                        <v-btn class="text-success" @click.stop="likePost()">Likes</v-btn>
                        <div class="ml-5">Total likes : {{post.likes}}</div>
                    </v-col>
                    <v-col cols="12" md="6" class="d-flex align-center">
                        <v-btn class="text-error" @click.stop="dislikePost()">Dislikes</v-btn>
                        <div class="ml-5">Total dislikes : {{post.dislikes}}</div>
                    </v-col>
                </v-col>
            </v-row>
        </v-container>
        <p style="white-space: pre-line">{{post.content}}</p>
        <v-divider></v-divider>
        <p class="mt-4">Last modified : {{new Date(post.date).toDateString()}}</p>
    </v-container>
    <v-container>
        <v-row justify="space-around">
            <router-link :to="{name: 'postUpdate'}">
                <v-btn v-if="auth" tile color="success">
                    <v-icon left>mdi-pencil</v-icon>
                    EDIT
                </v-btn>
            </router-link>
            <v-btn v-if="auth" @click.stop="deletePost()" tile color="error">DELETE</v-btn>
            <router-link :to="{name: 'home'}">
                <v-btn class="bg-tertiary" tile>GO BACK</v-btn>
            </router-link>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
    import {onMounted, ref} from "vue"
    import {useRoute, useRouter} from "vue-router"

    const route = useRoute()
    const router = useRouter()

    const post = ref([])
    const like = ref(0)
    const auth = ref(false)

    const parsedStorage = JSON.parse(localStorage.user)
    const id = route.params.id
    const serverUrl = `http://localhost:8080/api/post/${id}`

    interface Callback {
        (message: string): void
    }

    const callFetch = (url: string, options: { method: string, mode: 'cors', headers: { Authorization: string } }, cb: Callback) => {
        return fetch(url, options)
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
            })
            .then(data => cb(data))
            .catch(err => console.error(err.message))
    }

    const getOptions: { method: string, mode: 'cors', headers: { Authorization: string } } = {
        method: 'GET',
        mode: 'cors',
        headers: {
            Authorization: `token ${parsedStorage.token}`
        }
    }

    const getData = () => {
        callFetch(serverUrl, getOptions, (data) => {
            post.value = data
            if (data.usersLiked.includes(parsedStorage.userId)) {
                like.value = 1
            }
            if (data.usersDisliked.includes(parsedStorage.userId)) {
                like.value = -1
            }
            if (data.userId === parsedStorage.userId || parsedStorage.role === "Admin") {
                auth.value = true
            }
        })
    }

    onMounted(() => {
        getData();
    })

    const deleteOptions: { method: string, mode: 'cors', headers: { Authorization: string } } = {
        method: 'DELETE',
        mode: 'cors',
        headers: {
            Authorization: `token ${parsedStorage.token}`
        }
    }

    const deletePost = () => {
        callFetch(serverUrl, deleteOptions, () => {
            router.push({name: 'home'})
        })
    }

    const likePost = () => {
        let likeValue = {}
        const likeObject = () => {
            switch (like.value) {
                case 0:
                    like.value = 1
                    return likeValue = {
                        like: 1,
                        userId: parsedStorage.userId
                    }
                case 1:
                    like.value = 0
                    return likeValue = {
                        like: 0,
                        userId: parsedStorage.userId
                    }
            }
        }

        likeObject();

        const likeOptions: { method: string, mode: 'cors', headers: { "Content-Type": string, Authorization: string }, body: string } = {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                Authorization: `token ${parsedStorage.token}`
            },
            body: JSON.stringify(likeValue)
        }

        callFetch(`${serverUrl}/like`, likeOptions, () => {
            getData()
        })
    }

    const dislikePost = () => {
        let dislikeValue = {}
        const dislikeObject = () => {
            switch (like.value) {
                case 0:
                    like.value = -1
                    return dislikeValue = {
                        like: -1,
                        userId: parsedStorage.userId
                    }
                case -1:
                    like.value = 0
                    return dislikeValue = {
                        like: 0,
                        userId: parsedStorage.userId
                    }
            }
        }

        dislikeObject();

        const dislikeOptions: { method: string, mode: 'cors', headers: { "Content-Type": string, Authorization: string }, body: string } = {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                Authorization: `token ${parsedStorage.token}`
            },
            body: JSON.stringify(dislikeValue)
        }

        callFetch(`${serverUrl}/like`, dislikeOptions, () => {
            getData()
        })
    }

</script>



