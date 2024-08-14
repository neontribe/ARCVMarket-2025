<template id="masthead">
  <div class="wrapper">
    <header>
      <div
        class="logo"
        v-bind:class="{
          login: $route.meta.auth === false || $route.path === '/user'
        }"
      >
        <router-link
          v-if="!($route.path === '/login' || $route.path === '/user')"
          class="link"
          v-bind:to="'/'"
          ><img alt="ARC Voucher logo" src="../assets/logo.png"
        /></router-link>
        <img v-else alt="ARC Voucher logo" src="../assets/logo.png" />
      </div>

      <nav v-if="headerFull" role="navigation">
        <ul>
          <li>
            <router-link v-bind:to="'/'"
              ><i aria-hidden="true" class="fa fa-keyboard-o"></i><br />Add
              Voucher
            </router-link>
          </li>
          <li>
            <router-link v-bind:to="'/payment'"
              ><i aria-hidden="true" class="fa fa-rocket"></i
              ><br />Get<br />Payment
            </router-link>
          </li>
          <li>
            <router-link v-bind:to="'/account'"
              ><i aria-hidden="true" class="fa fa-user"></i
              ><br />My<br />Account
            </router-link>
          </li>
        </ul>
      </nav>
    </header>

    <profile v-if="headerFull"></profile>
    <toolbar v-if="toolbarShow"></toolbar>
  </div>
</template>

<script>
import Profile from '../components/Profile.vue';
import Toolbar from '../components/Toolbar.vue';

export default {
  name: 'masthead',
  components: {
    Profile,
    Toolbar
  },
  computed: {
    headerFull: function () {
      const paths = ['/login', '/user', '/request', '/change-password'];
      return paths.indexOf(this.$route.path) === -1;
    },
    toolbarShow: function () {
      const paths = ['/', '/scan'];
      return !(paths.indexOf(this.$route.path) === -1);
    }
  }
};
</script>
