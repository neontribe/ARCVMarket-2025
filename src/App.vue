<template>
    <div id="app">
        <masthead></masthead>
        <router-view v-slot="{ Component }">
            <transition name="fade">
                <Component :is="Component" />
            </transition>
        </router-view>
        <privacy-link v-if="footerShow"></privacy-link>
    </div>
</template>

<script>
import Masthead from './components/Masthead.vue';
import PrivacyLink from './components/PrivacyLink.vue';

export default {
    name: 'app',
    components: {
        Masthead,
        PrivacyLink
    },
    computed: {
        footerShow: function () {
            const paths = ['/', '/scan', '/payment', '/account'];
            return paths.indexOf(this.$route.path) !== -1;
        }
    }
};
</script>

<style lang="scss">
@import './sass/app.scss';
</style>
