import { createRouter, createWebHistory } from "vue-router";
import LogIn from "../views/auth/LogInView.vue";
import SignUp from "../views/auth/SignUpView.vue";
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
		path: "/auth/sign_up",
		name: "signUp",
		component: SignUp,
	},
	{
		path: "/auth/log_in",
		name: "logIn",
		component: LogIn,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach((to) => {
	if (!localStorage.user && to.name !== "logIn" && to.name !== "signUp") {
		return { name: "logIn", query: { nextUrl: to.fullPath } };
	}
	return true;
});

export default router;
