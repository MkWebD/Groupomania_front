import { createRouter, createWebHistory } from "vue-router";
import Authentication from "../views/auth/AuthenticationView.vue";
import AllPosts from "../views/posts/AllPosts.vue";
import CreatePost from "../views/posts/CreatePost.vue";
import SinglePost from "../views/posts/SinglePost.vue";
import UpdatePost from "../views/posts/UpdatePost.vue";

const routes = [
	{
		path: "/",
		name: "home",
		component: AllPosts,
	},
	{
		path: "/:id",
		name: "post",
		component: SinglePost,
	},
	{
		path: "/newPost",
		name: "postCreation",
		component: CreatePost,
	},
	{
		path: "/:id",
		name: "postUpdate",
		component: UpdatePost,
	},
	{
		path: "/auth",
		name: "auth",
		component: Authentication,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach((to) => {
	if (!localStorage.user && to.name !== "auth") {
		return { name: "auth", query: { nextUrl: to.fullPath } };
	}
	return true;
});

export default router;
