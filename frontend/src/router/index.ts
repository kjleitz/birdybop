import { createRouter, createWebHistory, type RouteLocationNormalized, type RouteMeta, type RouteRecordNormalized, type RouteRecordRaw } from "vue-router";
import Home from "@/views/Home.vue";
import { useNavigationStore } from "@/stores/navigation";
import { useSessionStore } from "@/stores/session";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/about",
      name: "About",
      component: () => import("@/views/About.vue"),
    },
    {
      path: "/sign_in",
      name: "SignIn",
      component: () => import("@/views/SignIn.vue"),
    },
    {
      path: "/sign_up",
      name: "SignUp",
      component: () => import("@/views/SignUp.vue"),
    },
    {
      path: "/search_results",
      name: "SearchResults",
      component: () => import("@/views/SearchResults.vue"),
    },
    {
      path: "/sources",
      component: () => import("@/views/Sources.vue"),
      children: [
        {
          path: "",
          name: "SourcesIndex",
          component: () => import("@/views/SourcesIndex.vue"),
        },
        {
          path: "new",
          name: "SourcesNew",
          component: () => import("@/views/SourcesNew.vue"),
          meta: {
            authRequired: true,
          },
        },
        {
          path: ":encodedSourcePath",
          component: () => import("@/views/Source.vue"),
          children: [
            {
              path: "",
              name: "SourceShow",
              component: () => import("@/views/SourceShow.vue"),
            },
            {
              path: "edit",
              name: "SourceEdit",
              component: () => import("@/views/SourceEdit.vue"),
              meta: {
                authRequired: true,
                rolesAllowed: ["admin"],
              },
            },
            {
              path: "comments",
              component: () => import("@/views/SourceComments.vue"),
              children: [
                {
                  path: "",
                  name: "SourceCommentsIndex",
                  component: () => import("@/views/SourceCommentsIndex.vue"),
                },
                {
                  path: "new",
                  name: "SourceCommentsNew",
                  component: () => import("@/views/SourceCommentsNew.vue"),
                  meta: {
                    authRequired: true,
                  },
                },
                {
                  path: "edit",
                  name: "SourceCommentsEdit",
                  component: () => import("@/views/SourceCommentsEdit.vue"),
                  meta: {
                    authRequired: true,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "/users",
      component: () => import("@/views/Users.vue"),
      children: [
        {
          path: "",
          name: "UsersIndex",
          component: () => import("@/views/UsersIndex.vue"),
        },
        {
          path: ":username",
          component: () => import("@/views/User.vue"),
          children: [
            {
              path: "",
              name: "UserShow",
              component: () => import("@/views/UserShow.vue"),
            },
            {
              path: "edit",
              name: "UserEdit",
              component: () => import("@/views/UserEdit.vue"),
            },
          ],
        },
      ],
    },
  ],
});

const findInMatchedRoutes = (
  route: RouteLocationNormalized,
  condition: (routeRecord: RouteLocationNormalized | RouteRecordNormalized) => boolean,
): RouteLocationNormalized | RouteRecordNormalized | undefined => {
  // If the given route matches, then great, we'll use that.
  if (condition(route)) return route;

  // We want to go through the matched routes in reverse order; from most
  // immediate ancestor to most distant ancestor.
  const matchedRoutes = route.matched;
  for (let i = matchedRoutes.length - 1; i >= 0; i--) {
    const parent = matchedRoutes[i];
    if (condition(parent)) return parent;
  }
};

const routeWhereMeta = (
  route: RouteLocationNormalized,
  condition: (meta: RouteMeta) => boolean,
): RouteLocationNormalized | RouteRecordNormalized | undefined => {
  return findInMatchedRoutes(route, (routeRecord) => condition(routeRecord.meta ?? {}));
};

// If the route has `requiresAuth: true` or `requiresAuth: false` in its `meta`,
// then the value of `requiresAuth` will be returned. If it does not, but one of
// its parents does, then the `requiresAuth` value of the most immediate parent
// with a specified value will be returned. Otherwise, returns false.
export const routeRequiresAuth = (route: RouteLocationNormalized): boolean => {
  const authSpecified = routeWhereMeta(route, ({ authRequired }) => typeof authRequired === "boolean");
  return authSpecified?.meta?.authRequired as boolean ?? false;
};

router.beforeEach((to, _from, next) => {
  const navigationStore = useNavigationStore();
  const sessionStore = useSessionStore();

  // If they're already going to their previously-intended destination, then get
  // rid of the intended destination. If it needs to be set again, that will
  // happen later, below.
  if (to.fullPath === navigationStore.intendedDestination) navigationStore.clearIntendedDestination();

  // If they're logged in already, or if the route is public, let them through.
  if (sessionStore.isLoggedIn || !routeRequiresAuth(to)) return next();

  // This route requires login, and they are not logged in. We'll store their
  // intended destination before redirecting them to `/sign_in`...
  navigationStore.setIntendedDestination(to.fullPath);

  // ...and then redirect them to `/sign_in`.
  next({ name: "SignIn" });
});

export default router;
