import constants from '../constants';

import Message from '../components/Message.vue';

export default {
    data: () => ({
        message: {
            state: constants.MESSAGE_STATUS,
            text: ''
        }
    }),

    components: {
        Message
    },

    methods: {
        setMessage(message) {
            this.message = message;
        },
        emitMessage(text, state = null, eventName = 'message-update') {
            this.$eventBus.emit(eventName, { text: text, state: state });
        }
    }
};
