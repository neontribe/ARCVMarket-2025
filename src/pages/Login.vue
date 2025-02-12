<template>
    <div>
        <main class="container" id="login">
            <div class="content narrow">
                <h1>Log In</h1>

                <transition name="fade">
                    <message
                        v-bind:text="message.text"
                        v-bind:state="message.state"
                    ></message>
                </transition>

                <div>
                    <form id="loginForm" v-on:submit.prevent="onLogin">
                        <label for="userName">Username</label>
                        <input
                            type="text"
                            v-model="username"
                            id="userName"
                            required
                        />
                        <label for="userPassword">Password</label>
                        <input
                            type="password"
                            v-model="password"
                            id="userPassword"
                            required
                        />
                        <button type="submit" value="Log In">Log In</button>
                    </form>

                    <div class="footer-links">
                        <div>
                            <RouterLink
                                to="/request"
                                class="secondary"
                            >Forgot your password?</RouterLink>
                        </div>
                        <div>
                            <a
                                href="https://www.alexandrarose.org.uk/privacy-policy-for-traders"
                                class="secondary"
                                id="privacy"
                                >Privacy Policy</a
                            >
                        </div>
                    </div>
                </div>
            </div>

            <div class="build">
                <div class="version">{{ appV }}</div>
                <div class="commit" v-if="env === 'development'">
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
    mixins: [mixin.messages],
    data: function () {
        return {
            // TODO: Put in a store.
            // https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22
            passedMessage: window.history.state?.passedMessage,
            username: null,
            password: null,
            remember: true,
            commitMsg: VERSION,
            appV: Config.appVersion,
            env: Config.env
        };
    },
    mounted: function () {
        console.log(this.$router.state);
        if (this.passedMessage) {
            this.setMessage(this.passedMessage?.text, this.passedMessage?.state);
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
                () => {
                    this.errorMessage = null;
                    const redirect = this.$route.query.redirect ?? '/scan';
                    this.$router.push({ path: redirect });
                },
                (errMsg) => {
                    this.setMessage(errMsg, constants.MESSAGE_ERROR);
                }
            );
        }
    }
};
</script>
