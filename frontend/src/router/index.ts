import { createRouter, createWebHashHistory } from "vue-router";
import Dashboard from "../pages/Dashboard.vue";
import ProjectManage from "../pages/ProjectManage.vue";
import ExperimentRecords from "../pages/ExperimentRecords.vue";
import ReagentManage from "../pages/ReagentManage.vue";
import ReagentUsages from "../pages/ReagentUsages.vue";

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", redirect: "/dashboard" },
    { path: "/dashboard", component: Dashboard },
    { path: "/projects", component: ProjectManage },
    { path: "/experiments", component: ExperimentRecords },
    { path: "/reagents", component: ReagentManage },
    { path: "/reagent-usages", component: ReagentUsages }
  ]
});

export { Dashboard, ProjectManage, ExperimentRecords, ReagentManage, ReagentUsages };
