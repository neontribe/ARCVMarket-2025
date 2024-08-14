<template>
  <div>
    <main id="login" class="container">
      <div class="content narrow">
        <h1>Log In</h1>

        <transition name="fade">
          <message
            v-bind:state="message.state"
            v-bind:text="message.text"
          ></message>
        </transition>

        <div>
          <form id="loginForm" v-on:submit.prevent="onLogin">
            <label for="userName">Username</label>
            <input id="userName" v-model="username" required type="text" />
            <label for="userPassword">Password</label>
            <input
              id="userPassword"
              v-model="password"
              required
              type="password"
            />
            <button type="submit" value="Log In">Log In</button>
          </form>

          <div class="footer-links">
            <div>
              <router-link class="secondary" v-bind:to="'/request'"
                >Forgot your password?
              </router-link>
            </div>
            <div>
              <a
                id="privacy"
                class="secondary"
                href="https://www.alexandrarose.org.uk/privacy-policy-for-traders"
                >Privacy Policy</a
              >
            </div>
          </div>
        </div>
      </div>

      <div class="build">
        <div class="version">{{ appV }}</div>
        <div v-if="env === 'development'" class="commit">
          Commit: {{ commitMsg }}
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Config from '../config.js';
import Store from '../store.js';
import mixin from '../mixins/mixins';
import constants from '../constants';

export default {
  name: 'login',
  props: ['passedMessage'],
  mixins: [mixin.messages],
  data: function () {
    return {
      username: null,
      password: null,
      remember: true,
      commitMsg: VERSION,
      appV: Config.appVersion,
      env: Config.env
    };
  },
  mounted: function () {
    if (this.passedMessage) {
      this.setMessage(this.passedMessage.text, this.passedMessage.state);
    }
  },
  methods: {
    /**
     * prods the store to make it login
     */
    onLogin: function () {
      const userApiCredentials = {
        username: this.username,
        password: this.password
      };

      Store.authenticate(
        userApiCredentials,
        function () {
          this.errorMessage = null;
          // I don't like this here, but it's the only place it works for now.
          let redirect = this.$route.query.redirect;
          if (!redirect) {
            redirect = '/scan';
          }
          this.$router.push({ path: redirect });
        }.bind(this),

        function (errMsg) {
          this.setMessage(errMsg, constants.MESSAGE_ERROR);
        }.bind(this)
      );
    }
  }
};
</script>
