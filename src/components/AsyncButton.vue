<template>
    <button
        class="cta"
        v-bind:class="state"
        :disabled="state !== ''"
        @click="onClick"
    >
        <span v-if="state === ''"><slot /></span>
        <span v-if="state === 'fail'"
            ><font-awesome-icon icon="fa-solid fa-times" size="2x" beat-fade
        /></span>
        <span v-if="state === 'validate'"
            ><font-awesome-icon icon="fa-solid fa-check" size="2x" beat-fade
        /></span>
        <span v-if="state === 'queued'"
            ><font-awesome-icon icon="fa-solid fa-clock" size="2x"
        /></span>
        <span v-if="state === 'spinner'">
            <font-awesome-icon
                icon="fa-solid fa-spinner"
                size="xl"
                spin
                class="spaced"
            /><span>Please wait...</span>
        </span>
    </button>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faTimes,
    faCheck,
    faClock,
    faSpinner
} from '@fortawesome/free-solid-svg-icons';
export default {
    name: 'async-button',
    props: {
        onClick: { type: Function, required: true },
        state: String
    },
    components: {
        FontAwesomeIcon
    },
    created() {
        library.add(...[faTimes, faCheck, faClock, faSpinner]);
    },
    data: function () {
        return {};
    },
    computed: {},
    watch: {},
    methods: {}
};
</script>

<style lang="scss" scoped>
@use '../sass/vars' as *;
.spinner,
.validate,
.fail,
.queued {
    color: $arc_white;
}
.spinner {
    background: $arc_rose;
}
.validate {
    background: $arc_success;
}
.fail {
    background: $arc_error;
}
.queued {
    background: $arc_warning;
}
.spaced {
    margin-right: 0.5rem;
}
</style>
