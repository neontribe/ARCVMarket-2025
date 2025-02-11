<template>
    <div>
        <main class="container" id="user">
            <div v-if="traderList" class="content narrow">
                <h1>Choose a trader to manage</h1>

                <form
                    id="frmChooseTrader"
                    class="form-group"
                    v-on:submit.prevent="onContinue"
                    @keyup.enter="onContinue"
                >
                    <div
                        v-for="(trader, index) in this.userTraders"
                        :key="trader.id"
                    >
                        <div class="multiple-choice">
                            <input
                                :id="'radio-' + index"
                                :value="trader.id"
                                v-model="checked"
                                type="radio"
                                name="radio-group"
                                required
                            />
                            <label :for="'radio-' + index">{{trader.name}}</label>
                        </div>
                    </div>

                    <button
                        id="continue"
                        type="submit"
                        value="Continue"
                        v-on:keyup.enter="onContinue"
                    >
                        Continue
                    </button>
                </form>
            </div>
        </main>
    </div>
</template>

<script>
import Store from '../store.js';
export default {
    name: 'user',
    data() {
        return {
            userTraders: Store.user.traders,
            checked: [] // Is at least one radio button clicked.
        };
    },
    computed: {
        traderList: function () {
            if (this.userTraders?.length === 1) {
                Store.setUserTrader(this.userTraders[0].id);
                this.redirect();
            }
            return this.userTraders?.length > 1;
        },
    },
    mounted: function () {
        Store.getUserTraders();
    },
    methods: {
        onContinue: function () {
            if (Store.setUserTrader(this.checked)) {
                this.redirect();
            }
        },
        redirect: function () {
            const redirect = this.$route.query?.redirect || '/';
            this.$router.push({ path: redirect });
        }
    }
};
</script>
