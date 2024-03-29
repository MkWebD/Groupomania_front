import { createRouter, createWebHistory } from "vue-router";
import Authentication from "../views/auth/AuthenticationView.vue";
import AllPosts from "../views/posts/AllPosts.vue";

const routes = [
	{
		path: "/",
		name: "home",
		component: AllPosts,
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
