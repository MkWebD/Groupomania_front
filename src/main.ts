import { createApp } from "vue";
import App from "./App.vue";
import { loadFonts } from "./plugins/webfontloader";
import router from "./router";
import store from "./store";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faCalendar,
	faPaperPlane,
	faPenToSquare,
	faThumbsDown,
	faThumbsUp,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faCalendar, faThumbsUp, faThumbsDown, faPaperPlane, faPenToSquare, faTrash);

loadFonts();

createApp(App).use(router).use(store).component("font-awesome-icon", FontAwesomeIcon).mount("#app");
