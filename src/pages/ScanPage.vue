<template>
    <div>
        <main id="scan" class="container">
            <div class="content narrow">
                <h1>Scan a voucher code</h1>

                <form id="textVoucher" v-on:submit.prevent>
                    <message
                        v-bind:state="message.state"
                        v-bind:text="message.text"
                    />

                    <label id="lblSponsorBox" class="hidden" for="sponsorBox"
                        >Sponsor Code</label
                    >
                    <label id="lblVoucherBox" class="hidden" for="voucherBox"
                        >Voucher Code</label
                    >

                    <div class="input-box">
                        <input
                            id="sponsorBox"
                            ref="sponsorBox"
                            v-model="sponsorCode"
                            maxlength="5"
                            minlength="2"
                            type="text"
                            @keydown="onKeypressSponsorBox"
                            v-on:paste.prevent
                            @keydown.enter.prevent
                            autocomplete="off"
                            autofocus="autofocus"
                        />
                        <input
                            id="voucherBox"
                            ref="voucherBox"
                            v-model="voucherCode"
                            maxlength="8"
                            minlength="4"
                            pattern="[0-9]*"
                            type="tel"
                            @keydown="onKeypressVoucherBox"
                            v-on:paste.prevent
                            v-on:keyup.delete="onDelVoucherBox"
                            autocomplete="off"
                        />
                    </div>
                    <async-button
                        id="submit-voucher"
                        v-bind:state="state"
                        :onClick="onRecordVoucher"
                    >
                        Add Code
                    </async-button>
                </form>
            </div>

            <div>
                <queue @message-update="setMessage" />
            </div>
        </main>
    </div>
</template>

<script>
import Store from '../store.js';
import Queue from '../components/Queue.vue';
import constants from '../constants.js';
import AsyncButtonMixin from '../mixins/AsyncButtonMixin';
import MessageMixin from '../mixins/MessageMixin';

const RESULT_TIMER = 1000;
let TIMER = null;

export default {
    name: 'ScanPage',
    mixins: [MessageMixin, AsyncButtonMixin],
    components: {
        Queue
    },
    data: function () {
        return {
            sponsorCode: '',
            voucherCode: '',
            vouchers: Store.trader.vouchers,
            recVouchers: Store.trader.recVouchers,
            netMgr: Store.netMgr
        };
    },
    methods: {
        onRecordVoucher: function () {
            //TODO: some proper validation
            // When the voucher is submitted, cancel the typing in voucher box timer
            TIMER = null;
            if (this.voucherCode?.length > 0) {
                this.startSpinner();
                Store.addVoucherCode(
                    this.sponsorCode.toUpperCase() + this.voucherCode,
                    // Success function
                    (response) => {
                        const responseData = response.data;
                        if (responseData.error) {
                            this.updateOp('fail', RESULT_TIMER);
                            this.setMessage(
                                responseData.error,
                                constants.MESSAGE_ERROR
                            );
                        } else if (responseData.warning) {
                            this.updateOp('fail', RESULT_TIMER);
                            this.setMessage(
                                responseData.warning,
                                constants.MESSAGE_WARNING
                            );
                        } else {
                            // all in!
                            this.updateOp('validate', RESULT_TIMER);
                            this.message = {};
                            // We're intentionally not setting to responseData.message here.
                        }
                        // The server has processed our list, clear it.
                        Store.clearVouchers();
                        Store.getRecVouchers();
                    },
                    // Failure function, hook for error message
                    () => {
                        // Network error of some kind;
                        // Don't clear the voucher list!
                        if (!this.netMgr.online) {
                            // set that voucher offline so it goes in the queue
                            this.vouchers[this.vouchers.length - 1].online =
                                false;
                            this.updateOp('queued', RESULT_TIMER);
                            this.setMessage(
                                constants.copy.VOUCHER_LOST_SIGNAL,
                                constants.MESSAGE_WARNING
                            );
                        }
                    }
                );
                // Do anyway.
                this.voucherCode = '';
                this.sponsorCode = '';
                this.$refs.sponsorBox.focus();
            } else {
                this.updateOp('fail', RESULT_TIMER);
                this.setMessage(
                    constants.copy.VOUCHER_SUBMIT_INVALID,
                    constants.MESSAGE_ERROR
                );
            }
        },
        /**
         * When the deleting an empty voucherCode,
         *  select the text in the other box
         */
        onDelVoucherBox: function () {
            if (this.voucherCode === null || this.voucherCode.length === 0) {
                this.$refs.sponsorBox.select();
            }
        },

        /**
         * When the sponsorBox is about to change
         *  have a number in it - switch to the voucherBox;
         *  have a smalls in it - caps it.
         */
        onKeypressSponsorBox: function (event) {
            const rxNumber = /\d/;
            const rxSmalls = /^[a-z]$/;
            const rxCaps = /^[A-Z]$/;
            const rxSlash = /\//gi;

            // There's also "event.key" (string), which MDN thinks is better;
            const char = this.getKeyCharCode(event);

            if (
                this.sponsorCode.length <
                this.$refs.sponsorBox.getAttribute('maxlength')
            ) {
                if (char.match(rxCaps)) {
                    event.preventDefault();
                    this.sponsorCode += char;
                }
                if (char.match(rxSmalls)) {
                    event.preventDefault();
                    this.sponsorCode += char.toUpperCase();
                }
            }

            if (char.match(rxNumber)) {
                event.preventDefault();
                if (
                    this.voucherCode.length <
                    this.$refs.voucherBox.getAttribute('maxlength')
                ) {
                    this.$refs.voucherBox.focus();
                    this.voucherCode += char;
                }
                return false;
            }

            if (char.match(rxSlash)) {
                event.preventDefault();
                if (
                    this.voucherCode.length <
                    this.$refs.voucherBox.getAttribute('maxlength')
                ) {
                    this.$refs.voucherBox.focus();
                }
                return false;
            }
        },
        onKeypressVoucherBox: function (event) {
            const rxNumber = /\d/;
            const char = this.getKeyCharCode(event);
            const voucherBoxMaxLength = parseInt(
                this.$refs.voucherBox.getAttribute('maxlength')
            );

            // If we have a number
            if (char.match(rxNumber)) {
                if (!TIMER) {
                    this.delay(() => {
                        // When the box gets full, cancel any timers, else remove input and refocus
                        if (this.voucherCode.length === voucherBoxMaxLength) {
                            TIMER = null;
                        } else {
                            this.voucherCode = '';
                            this.sponsorCode = '';
                            this.$refs.sponsorBox.focus();
                        }
                        TIMER = null;
                    }, 400);
                }
                return;
            }
            //allow enter key to submit
            if (event.key === 'Enter') {
                this.onRecordVoucher();
            }
            event.preventDefault();
            return false;
        },
        getKeyCharCode: function (event) {
            // Try to cross-platform catch the keycode
            // Note, there's also "event.which" (int)
            // There's also "event.key" (string), which MDN thinks is better;
            const charCode = event.keyCode ?? event.charCode;
            return String.fromCharCode(charCode);
        },
        delay: function (callback, ms) {
            clearTimeout(TIMER);
            TIMER = setTimeout(callback, ms);
        }
    },
    mounted: function () {
        Store.maybeGetRecVouchers();
        this.$nextTick(() => {
            if (this.$refs.sponsorBox) {
                this.$refs.sponsorBox.focus();
            }
        });
    }
};
</script>
