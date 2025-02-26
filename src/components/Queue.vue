<template id="queue">
    <Transition name="fade">
        <div v-if="currentlyShown" class="content narrow queuedVouchers">
            <h1>Voucher not added</h1>
            <p>
                You have <strong>{{ queueStatus.count }}</strong> voucher{{
                    queueStatus.plural
                }}
                not added. Press here to add.
            </p>
            <async-button
                id="submit-voucher"
                v-bind:state="state"
                :onClick="onSubmitQueue"
            >
                Resubmit Vouchers
            </async-button>
            <div
                v-on:click="collapsed = !collapsed"
                class="expandable queue"
                v-bind:class="{ expanded: !collapsed }"
            >
                <i class="fa fa-list" aria-hidden="true"></i>
            </div>
            <div
                class="list-wrapper"
                v-bind:class="{ 'is-collapsed': collapsed }"
            >
                <div class="voucher-list">
                    <!-- Tab header -->
                    <div class="tab thead">
                        <div class="row-code">
                            <div>Voucher code</div>
                        </div>
                    </div>

                    <!-- Tab row -->
                    <div
                        class="tab row"
                        v-for="voucher in vouchers"
                        :key="voucher.code"
                    >
                        <div class="row-code">
                            <div>{{ voucher.code }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script>
import Store from '../store.js';

import constants from '../constants';
import AsyncButtonMixin from '../mixins/AsyncButtonMixin';

const RESULT_TIMER = 3000;

export default {
    name: 'queue',
    mixins: [AsyncButtonMixin],
    emits: ['message-update'],
    data: function () {
        return {
            queue: Store.queue,
            collapsed: true,
            show: true,
            netMgr: Store.netMgr,
            vouchers: Store.trader.vouchers
        };
    },
    mounted: function () {
        if (this.queue.sendingStatus) {
            this.startSpinner();
        }
    },
    computed: {
        currentlyShown: function () {
            return (
                this.vouchers.length >= 1 && !Store.getVouchersOnlineStatus()
            );
        },
        queueStatus: function () {
            const count = this.vouchers.length;
            const plural = count === 1 ? '' : 's';
            return { count: count, plural: plural };
        }
    },
    methods: {
        emitMessage: function (text = '', state = null, eventName = 'message-update') {
            this.$emit(eventName, text, state);
        },
        onSubmitQueue: function () {
            this.startSpinner();

            Store.transitionVouchers(
                'collect',
                Store.getTraderVoucherList(),
                (response) => {
                    // The server has processed our list, clear it.
                    Store.clearVouchers();
                    Store.getRecVouchers();

                    let message = '';
                    let messageType = constants.MESSAGE_SUCCESS;

                    // We need to check warning because a queue can contain just one voucher.
                    if (response.data.warning) {
                        message = response.data.warning;
                        messageType = constants.MESSAGE_WARNING;
                    } else if (response.data.message) {
                        message = response.data.message;
                    }
                    this.updateOp('validate', RESULT_TIMER);
                    this.emitMessage(message, messageType);
                },
                () => {
                    this.updateOp('fail', RESULT_TIMER);
                    this.emitMessage(
                        constants.copy.QUEUE_NETWORK_ERROR,
                        constants.MESSAGE_ERROR
                    );
                }
            );
        }
    }
};
</script>
