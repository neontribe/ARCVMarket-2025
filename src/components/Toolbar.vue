<template id="toolbar">
    <div class="toolbar">
        <transition name="pulse">
            <div v-if="vouchersAdded" class="count">
                <router-link v-bind:to="'/payment'"
                    ><strong>{{ voucherCount }}</strong> voucher<span
                        v-if="voucherCount > 1"
                        >s</span
                    >
                    successfully added</router-link
                >
            </div>
        </transition>
        <div class="input-icons" v-if="showIcon">
            <router-link v-bind:to="'/'"
                ><i class="fa fa-keyboard-o" title="Type a voucher code"
                    ><span class="hidden offscreen"
                        >Type a voucher code</span
                    ></i
                ></router-link
            >
            <router-link v-bind:to="'/scan'" id="scanTool"
                ><i class="fa fa-barcode" title="Scan a voucher code"
                    ><span class="hidden offscreen"
                        >Scan a voucher code</span
                    ></i
                ></router-link
            >
        </div>
    </div>
</template>

<script>
import Store from '../store.js';
export default {
    name: 'toolbar',
    data: function () {
        return {
            recVouchers: Store.trader.recVouchers
        };
    },
    mounted: function () {
        if (Store.auth) {
            Store.maybeGetRecVouchers();
        }
    },
    computed: {
        voucherCount: function () {
            return this.vouchersAdded ? this.recVouchers[0].length : 0;
        },
        vouchersAdded: function () {
            return this.recVouchers[0] && this.recVouchers[0].length > 0;
        },
        showIcon: function () {
            return Store.trader?.featureOverride?.pageAccess?.tap ?? true;
        }
    }
};
</script>
