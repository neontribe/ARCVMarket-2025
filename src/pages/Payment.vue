<template>
  <div>
    <main id="payment" class="container fullwidth">
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
              v-bind:state="message.state"
              v-bind:text="message.text"
            ></message>
          </transition>

          <div class="content narrow">
            <async-button
              id="submit-voucher"
              :onClick="onRequestPayment"
              v-bind:state="state"
            >
              Request Payment
            </async-button>
          </div>

          <div
            class="expandable"
            v-bind:class="{ expanded: !collapsed }"
            v-on:click="collapsed = !collapsed"
          >
            <i aria-hidden="true" class="fa fa-list"></i>
          </div>

          <div
            class="list-wrapper"
            v-bind:class="{ 'is-collapsed': collapsed }"
          >
            <div
              v-if="vouchersAdded"
              id="registeredVouchers"
              class="voucher-list"
            >
              <!-- Tab header -->
              <div class="tab thead">
                <label>
                  <div class="row-code">
                    <div>Voucher code</div>
                    <div>Voucher added on</div>
                  </div>
                </label>
              </div>

              <!-- Tab row -->
              <div
                v-for="(recVoucher, index) in recVouchers[0]"
                :key="recVoucher.code"
                class="tab row"
              >
                <label>
                  <div class="row-code">
                    <div>
                      {{ recVoucher.code }}
                      <div class="icon">
                        <a
                          title="Delete voucher code"
                          v-on:click.prevent="onDelete(recVoucher, index)"
                          ><i aria-hidden="true" class="fa fa-trash"></i
                        ></a>
                      </div>
                    </div>
                    <div>{{ recVoucher.updated_at }}</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div v-else>
          <h1>There are no vouchers to request payment for. Add some!</h1>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Store from '../store.js';
import constants from '../constants';
import MessageMix from '../mixins/MessageMixin';
import AsyncButtonMixin from '../mixins/AsyncButtonMixin';

export default {
  name: 'payment',
  mixins: [MessageMix, AsyncButtonMixin],
  data: () => ({
    recVouchers: Store.trader.recVouchers,
    netMgr: Store.netMgr,
    collapsed: true
  }),
  computed: {
    voucherCount: function () {
      return this.vouchersAdded ? this.recVouchers[0].length : 0;
    },
    vouchersAdded: function () {
      return this.recVouchers[0] && this.recVouchers[0].length > 0;
    },
    paymentMessage: function () {
      return Store.trader.market.payment_message ?
          Store.trader.market.payment_message
        : constants.copy.PAYMENT_REQUEST_DEFAULT;
    }
  },
  methods: {
    onRequestPayment() {
      this.startSpinner();
      Store.pendRecVouchers(
        // on Success, route to /account
        () => {
          this.setMessage(this.paymentMessage, constants.MESSAGE_SUCCESS);
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
          this.$delete(Store.trader.recVouchers[0], index);
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
