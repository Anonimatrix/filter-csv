import { createRouter, createWebHistory } from "vue-router";
import FilterView from "../views/FilterView.vue";

const routes = [
    {
        path: "/",
        name: "home",
        component: FilterView,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
