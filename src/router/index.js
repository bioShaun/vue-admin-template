import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "Dashboard", icon: "dashboard" },
      },
    ],
  },

  {
    path: "/user",
    component: Layout,
    redirect: "/user/list",
    name: "User",
    meta: {
      title: "用户管理",
      icon: "user",
    },
    children: [
      {
        path: "list",
        component: () => import("@/views/user/UserList"), // Parent router-view
        name: "UserList",
        meta: { title: "用户列表" },
      },
      {
        path: "create",
        component: () => import("@/views/user/UserEdit"),
        meta: { title: "创建用户" },
      },
      {
        path: "edit/:id",
        component: () => import("@/views/user/UserEdit"),
        props: true,
      },
    ],
  },

  {
    path: "/project",
    component: Layout,
    redirect: "/project/list",
    name: "Project",
    meta: {
      title: "项目管理",
      icon: "folder_1",
    },
    children: [
      {
        path: "list",
        component: () => import("@/views/project/List"), // Parent router-view
        name: "ProjectList",
        meta: { title: "项目列表" },
      },
      {
        path: "create",
        component: () => import("@/views/project/Edit"),
        meta: { title: "创建项目" },
      },
      {
        path: "edit/:id",
        component: () => import("@/views/project/Edit"),
        props: true,
      },
    ],
  },

  {
    path: "/data",
    component: Layout,
    redirect: "/data/list",
    children: [
      {
        path: "list",
        name: "DataList",
        component: () => import("@/views/fastp/List"),
        meta: {
          title: "数据管理",
          icon: "data",
        },
      },
      {
        path: "detail/:id",
        component: () => import("@/views/fastp/Detail"),
        props: true,
        hidden: true,
      },
    ],
  },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
