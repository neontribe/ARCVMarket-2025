import { createRouter, createWebHistory } from 'vue-router';
import Store from '@/store.js';
import Tap from '@/pages/Tap.vue';
import Account from '@/components/Account.vue';
import Scan from '@/pages/Scan.vue';
import Payment from '@/pages/Payment.vue';
import Login from '@/pages/Login.vue';
import ChangePassword from '@/pages/ChangePassword.vue';
import User from '@/pages/User.vue';

/*
 route access rules
 auth -> true, user MUST be authenticated - friends only
 auth -> false, user MUST NOT be authenticated - stranger's only
 auth -> undefined, auth not important - public
 */

// Define routes
const routes = [
  {
    path: '/',
    component: Tap,
    meta: { auth: true },
    beforeEnter: function (to, from, next) {
      const param =
        Store.trader?.featureOverride?.pageAccess === false ?
          { path: '/scan' }
        : null;
      next(param);
    }
  },
  {
    path: '/account',
    component: Account,
    meta: { auth: true }
  },
  {
    path: '/scan',
    component: Scan,
    meta: { auth: true }
  },
  { path: '/payment', component: Payment, meta: { auth: true } },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { auth: false },
    props: true
  },
  { path: '/request', component: Request, meta: { auth: false } },
  {
    path: '/change-password',
    component: ChangePassword,
    meta: { auth: false }
  },
  { path: '/user', component: User, meta: { auth: true } },
  { path: '*', redirect: '/' }
];

const router = createRouter({
  routes,
  history: createWebHistory(),
  base:
    window.location.pathname
      // Split it up into path components
      .split('/')
      // Chop the last one off, there may only be one
      .slice(0, -1)
      // Rejoin the remainder (if any) and tap "/" on the back.
      .join('/') + '/'
});

// Route Guard rules for directing users
router.beforeEach(function (to, from, next) {
  const auth = Store.netMgr.isAuth();

  if (auth) {
    // authenticated
    if (!Store.trader.id && to.path !== '/user') {
      // ... no trader and not picking one? go to the trader chooser next
      // with a redirect for onward travel
      next({
        path: '/user',
        query: { redirect: to.path }
      });
      return;
    }
    if (!to.meta.auth) {
      // ... but heading to an unguarded page?
      // go to root.
      next({ path: '/' });
      return;
    }
  } else if (to.meta.auth) {
    // ... and accessing auth-guarded page
    // clear your session
    Store.netMgr.setTokenFromLocalStorage();
    Store.setUserTradersFromLocalStorage();
    // and go to login to try again.
    // before going back to that page you wanted
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
    return;
  }
  // business as usual, don't intercept the route, just move along
  next();
});

// The routing isn't foolproof; EG if the "back" button is hammered - this tries to catch that *after* transition.
router.afterEach(
  function (transition) {
    const auth = Store.netMgr.isAuth();
    Store.error = null;
    if (!auth && transition.meta.auth) {
      this.go('/');
    }
  }.bind(router)
);

export default router;
