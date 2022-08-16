import {createRouter, createWebHashHistory} from "vue-router";

const routes = [
    {
        path: "/",
        name: "home",
        component: () => require("../views/posts/AllPosts.vue"),
    },
    {
        path: "/:id",
        name: "post",
        component: () => require("../views/posts/SinglePost.vue")
    },
    {
        path: "/newPost",
        name: "postCreation",
        component: () => require("../views/posts/CreatePost.vue")
    },
    {
        path: "/:id",
        name: "postUpdate",
        component: () => require("../views/posts/UpdatePost.vue")
    },
    {
        path: "/auth/sign_up",
        name: "signUp",
        component: () => require("../views/auth/SignUpView.vue"),
    },
    {
        path: "/auth/log_in",
        name: "logIn",
        component: () => require("../views/auth/LogInView.vue"),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to) => {
    if (!localStorage.user && to.name !== 'logIn' && to.name !== 'signUp') {
        return {name: 'logIn'}
    }
})

export default router;
