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
                    v-if="
                        !($route.path === '/login' || $route.path === '/user')
                    "
                    v-bind:to="'/'"
                    class="link"
                    ><img src="../assets/logo.png" alt="ARC Voucher logo"
                /></router-link>
                <img v-else src="../assets/logo.png" alt="ARC Voucher logo" />
            </div>
            <nav role="navigation" v-if="headerFull">
                <ul>
                    <li>
                        <router-link v-bind:to="'/'"
                            ><i class="fa fa-keyboard-o" aria-hidden="true"> </i
                            ><br />Add Voucher</router-link
                        >
                    </li>
                    <li>
                        <router-link v-bind:to="'/payment'"
                            ><i class="fa fa-rocket" aria-hidden="true"></i
                            ><br />Get<br />Payment</router-link
                        >
                    </li>
                    <li>
                        <router-link v-bind:to="'/account'"
                            ><i class="fa fa-user" aria-hidden="true"></i
                            ><br />My<br />Account</router-link
                        >
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
            return paths.indexOf(this.$route.path) !== -1;
        }
    }
};
</script>
