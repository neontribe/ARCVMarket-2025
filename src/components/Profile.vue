<template id="profile">
    <div class="profile-bar">
        <div>
            <strong> {{ selectedTrader.name }} </strong>
            <router-link v-bind:to="'/user'" v-if="changeTrader">
                (Change trader)</router-link
            >
        </div>
        <a v-on:click="onLogout">Log out</a>
    </div>
</template>

<script>
import Store from '../store.js';
import constants from '../constants';
export default {
    name: 'profile',
    data: function () {
        return {
            selectedTrader: Store.trader,
            userTraders: Store.user.traders
        };
    },
    computed: {
        changeTrader: function () {
            return this.userTraders && this.userTraders.length > 1;
        }
    },
    methods: {
        onLogout: function () {
            Store.unAuthenticate();
            const routeObj = {
                name: 'login',
                state: {
                    passedMessage: {
                        text: constants.copy.USER_LOGOUT,
                        state: constants.MESSAGE_SUCCESS
                    }
                }
            };
            this.$router.push(routeObj);
        }
    },
    mounted: function () {
        if (Store.auth) {
            Store.getUserTraders();
        }
    }
};
</script>
