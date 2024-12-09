import { createApp } from 'vue';
import EventBus from './services/events';
import Config from './config.js';
import App from './App.vue';
import Store from './store';
import router from './router';
import constants from './constants';
import pjson from '../package.json';

console.info(
    'Build date: ' +
        BUILD_DATE +
        '\nBranch: ' +
        BRANCH +
        '\nGit commit: ' +
        VERSION
);
console.log('Package Version', pjson.version);
const app = createApp(App);

app.config.globalProperties.$store = Store;
app.config.globalProperties.$eventBus = EventBus;
app.mixin({
    mounted() {
        Store.config = Config;
    }
});
app.use(router);
app.mount('#app');

/**
 * Reset all stored information and redirect the user back to the login page when 'NetMgr.logout' is fired.
 */
EventBus.on('NetMgr.logout', function (statusCode = null) {
    Store.resetStore();

    // Setup the route object
    let routeObj = { name: 'login' };
    // Shall we prep a message for the login page
    if (statusCode) {
        let message = {};
        switch (statusCode) {
            // Refresh token failed
            case 401:
                message.text = constants.copy.TIMEOUT_LOGOUT;
                message.state = constants.MESSAGE_WARNING;
                break;
            // Access forbidden, Trader probably disabled for that User
            case 403:
                message.text = constants.copy.FORCED_LOGOUT;
                message.state = constants.MESSAGE_WARNING;
                break;
            default:
                message.text = constants.copy.UNKNOWN_EVENT;
                message.state = constants.MESSAGE_ERROR;
        }
        routeObj.params = { passedMessage: message };
    }
    router.push(routeObj);
});
