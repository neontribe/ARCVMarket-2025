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
                        v-for="(trader, index) in this.userTraders[0]"
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
                            <label :for="'radio-' + index">{{
                                trader.name
                            }}</label>
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
import Store from "../store.js";
export default {
    name: "user",
    data() {
        return {
            userTraders: Store.user.traders,
            checked: [], // Is at least one radio button clicked.
        };
    },
    watch: {
        userTraders: function (traders) {
            if (traders[0].length === 1) {
                Store.setUserTrader(traders[0][0].id);
                this.redirect();
            }
        },
    },
    computed: {
        traderList: function () {
            console.log("computed");
            return this.userTraders[0]?.length > 1 || false;
        },
    },
    mounted: function () {
        Store.getUserTraders();
        console.log(this.userTraders);
        console.log("mounted");
    },
    methods: {
        onContinue: function () {
            if (Store.setUserTrader(this.checked)) {
                this.redirect();
            }
        },
        redirect: function () {
            const redirect = this.$route.query?.redirect || "/";
            this.$router.push({ path: redirect });
        },
    },
};
</script>
