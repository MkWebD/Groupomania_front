<template>
    <v-container>
        <h1 class="text-center text-primary border-md rounded-shaped">Posts les plus récents</h1>
        <v-row class="mt-5 mb-5 justify-center">
            <router-link :to="{name: 'postCreation'}">
                <v-btn class="bg-tertiary">Add a new post</v-btn>
            </router-link>
        </v-row>
        <v-row>
            <PostCard/>
        </v-row>


    </v-container>
</template>

<script setup lang="ts">
    import PostCard from "../../components/PostCard.vue";
</script>

