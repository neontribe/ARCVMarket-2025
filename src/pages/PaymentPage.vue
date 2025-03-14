<template>
    <div>
        <main class="container fullwidth" id="payment">
            <div class="content fullwidth">
                <div v-if="vouchersAdded">
                    <h1>
                        You can request payment for
                        <strong>{{ voucherCount }}</strong> voucher<span
                            v-if="voucherCount > 1"
                            >s</span
                        >.
                    </h1>
                    <transition name="fade">
                        <message
                            v-bind:text="message.text"
                            v-bind:state="message.state"
                        />
                    </transition>

                    <div class="content narrow">
                        <async-button
                            id="submit-voucher"
                            v-bind:state="state"
                            :onClick="onRequestPayment"
                        >
                            Request Payment
                        </async-button>
                    </div>

                    <div
                        v-on:click="collapsed = !collapsed"
                        class="expandable"
                        v-bind:class="{ expanded: !collapsed }"
                    >
                        <i class="fa fa-list" aria-hidden="true"></i>
                    </div>

                    <div
                        class="list-wrapper"
                        v-bind:class="{ 'is-collapsed': collapsed }"
                    >
                        <div
                            class="voucher-list"
                            id="registeredVouchers"
                            v-if="vouchersAdded"
                        >
                            <!-- Tab header -->
                            <div class="tab thead">
                                <div class="row-code">
                                    <div>Voucher code</div>
                                    <div>Voucher added on</div>
                                </div>
                            </div>

                            <!-- Tab row -->
                            <div
                                class="tab row"
                                v-for="(recVoucher, index) in recVouchers[0]"
                                :key="recVoucher.code"
                            >
                                <div class="row-code">
                                    <div>
                                        {{ recVoucher.code }}
                                        <div class="icon">
                                            <a
                                                v-on:click.prevent="
                                                    onDelete(recVoucher, index)
                                                "
                                                title="Delete voucher code"
                                                ><i
                                                    class="fa fa-trash"
                                                    aria-hidden="true"
                                                ></i
                                            ></a>
                                        </div>
                                    </div>
                                    <div>{{ recVoucher.updated_at }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else>
                    <h1>
                        There are no vouchers to request payment for. Add some!
                    </h1>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import Store from '../store.js';
import constants from '../constants';
import MessageMixin from '../mixins/MessageMixin';
import AsyncButtonMixin from '../mixins/AsyncButtonMixin';

export default {
    name: 'PaymentPage',
    mixins: [MessageMixin, AsyncButtonMixin],
    data: () => ({
        recVouchers: Store.trader.recVouchers,
        netMgr: Store.netMgr,
        collapsed: true
    }),
    computed: {
        voucherCount: function () {
            return this.recVouchers[0]?.length ?? 0;
        },
        vouchersAdded: function () {
            return !!this.recVouchers[0]?.length;
        },
        paymentMessage: function () {
            return Store.trader.market.payment_message ?
                    Store.trader.market.payment_message
                :   constants.copy.PAYMENT_REQUEST_DEFAULT;
        }
    },
    methods: {
        onRequestPayment() {
            this.startSpinner();
            Store.pendRecVouchers(
                // on Success, route to /account
                () => {
                    this.setMessage(
                        this.paymentMessage,
                        constants.MESSAGE_SUCCESS
                    );
                    this.updateOp('validate');
                    this.$router.message = this.message;
                    this.$router.push('/account');
                },
                // on Failure... hook for an alert?
                () => {
                    this.updateOp('fail');
                    this.setMessage(
                        constants.copy.PAYMENT_REQUEST_ERROR,
                        constants.MESSAGE_ERROR
                    );
                }
            );
        },
        onDelete: function (recVoucher, index) {
            Store.delVoucher(
                recVoucher.code,
                () => {
                    this.recVouchers[0].splice(index, 1);
                    this.setMessage(
                        recVoucher.code + constants.copy.DELETE_VOUCHER_SUCCESS,
                        constants.MESSAGE_SUCCESS
                    );
                },
                () => {
                    this.setMessage(
                        recVoucher.code + constants.copy.DELETE_VOUCHER_FAIL,
                        constants.MESSAGE_ERROR
                    );
                }
            );
        }
    },
    mounted: function () {
        // initialise the current vouchers list;
        Store.maybeGetRecVouchers();
    }
};
</script>
