<template>
  <div>
    <main id="account" class="container fullwidth">
      <div class="content fullwidth">
        <h1>Requested Payments</h1>

        <transition name="fade">
          <message
            v-bind:state="message.state"
            v-bind:text="message.text"
          ></message>
        </transition>
        <div v-if="spinnerActive">
          <spinner
            text="Please wait, working on it..."
            v-bind:active="spinnerActive"
          />
        </div>
        <div v-else>
          <div v-if="voucherPayments.length > 0">
            <div>
              <p>
                Click the
                <span class="list-icon"
                  ><i aria-hidden="true" class="fa fa-list"></i
                ></span>
                icon below to view a payment record in more detail.
              </p>
              <p>
                To email yourself a specific payment record from the table
                below, select it and click 'Email selected payment record'.
              </p>
            </div>

            <div class="accordion">
              <!-- Tab header -->
              <div class="tab thead">
                <div class="row">
                  <div></div>
                  <div class="date"></div>
                  <div class="total"></div>
                  <div>Amount</div>
                  <div class="select-record"></div>
                </div>
              </div>
              <div
                v-for="(payment, index) in voucherPayments"
                :key="payment.pended_on"
                class="tab row"
              >
                <input :id="'tab-' + index" name="tabs" type="checkbox" />
                <div class="row">
                  <div>
                    <label :for="'tab-' + index"
                      ><i aria-hidden="true" class="fa fa-list"></i
                    ></label>
                  </div>
                  <div>{{ payment.pended_on }}</div>
                  <div class="count">
                    {{ payment.vouchers.length }}
                  </div>
                  <div class="amount">&pound;{{ payment.vouchers.length }}</div>
                  <div class="email">
                    <input
                      v-bind:id="payment.pended_on"
                      name="radio-group"
                      type="radio"
                      @click="recordSelect"
                    />
                  </div>
                </div>
                <div class="tab-content">
                  <div class="tab inner-thead">
                    <label></label>
                    <div class="row-code">
                      <div>Voucher code</div>
                      <div>Voucher added on</div>
                    </div>
                  </div>
                  <div
                    v-for="(voucher, index) in payment.vouchers"
                    :key="index"
                    class="tab"
                  >
                    <label>
                      <div class="row-code">
                        <div class="code">
                          {{ voucher.code }}
                        </div>
                        <div class="date">
                          {{ voucher.recorded_on }}
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div
                v-if="!pgBtnIsDisabled('current')"
                aria-describedby="pagination-label"
                aria-label="Pagination"
                class="tab row-pagination"
              >
                <div>
                  <button
                    id="first"
                    :disabled="pgBtnIsDisabled('first')"
                    aria-label="First Page"
                    class="small-button"
                    @click="pgChangePage"
                  >
                    <i aria-hidden="true" class="fa fa-angle-double-left" />
                  </button>
                </div>
                <div>
                  <button
                    id="prev"
                    :disabled="pgBtnIsDisabled('prev')"
                    aria-label="Previous page"
                    class="small-button"
                    @click="pgChangePage"
                  >
                    <i aria-hidden="true" class="fa fa-angle-left" />
                  </button>
                </div>
                <div>
                  <p id="pagination-label" class="page-of-pages">
                    {{ pageOfPages() }}
                  </p>
                </div>
                <div>
                  <button
                    id="next"
                    :disabled="pgBtnIsDisabled('next')"
                    aria-label="Next Page"
                    class="small-button"
                    @click="pgChangePage"
                  >
                    <i aria-hidden="true" class="fa fa-angle-right" />
                  </button>
                </div>
                <div>
                  <button
                    id="last"
                    :disabled="pgBtnIsDisabled('last')"
                    aria-label="Last Page"
                    class="small-button"
                    @click="pgChangePage"
                  >
                    <i aria-hidden="true" class="fa fa-angle-double-right" />
                  </button>
                </div>
              </div>
            </div>

            <div class="cta-buttons">
              <button
                :disabled="selected"
                v-on:click="onRequestSubmissionEmail"
              >
                Email selected payment record
              </button>
              <button
                id="requestVoucherHistoryEmail"
                v-on:click="onRequestVoucherHistoryEmail"
              >
                Email all payment records
              </button>
            </div>
          </div>

          <div v-else>
            <p>
              You don't have any payment records yet. Add some vouchers and
              request payment to see your payment records here.
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Store from '../store.js';
import NetMgr from '../services/netMgr.js';
import constants from '../constants';
import SpinnerMix from '../mixins/SpinnerMixin.js';
import MessageMix from '../mixins/MessageMixin';

export default {
  name: 'account',
  mixins: [MessageMix, SpinnerMix],
  data() {
    return {
      voucherPayments: Store.trader.pendedVouchers,
      voucherPagination: Store.pendedVoucherPagination,
      errorMessage: Store.error,
      goodFeedback: false,
      selected: true,
      selectedDate: null
    };
  },
  watch: {},
  methods: {
    recordSelect: function (event) {
      this.selected = false;
      // Default to requesting all.
      this.selectedDate = event.target.id || null;
    },
    onRequestSubmissionEmail: function () {
      const url = '/traders/' + Store.trader.id + '/voucher-history-email';
      this.requestEmailBeSent(url, {
        submission_date: this.selectedDate
      });
    },
    onRequestVoucherHistoryEmail: function () {
      const url = '/traders/' + Store.trader.id + '/voucher-history-email';
      this.requestEmailBeSent(url, {
        submission_date: null
      });
    },
    requestEmailBeSent: function (url, data) {
      // This is a POST, look for the data as a JSON object
      NetMgr.apiPost(url, data, (response) => {
        // write the response into the page
        let mailMsg;
        switch (response.status) {
          case 200:
            this.goodFeedback = true;
            mailMsg = response.data.message;
            break;
          default:
            this.goodFeedback = false;
            mailMsg = 'Something went wrong, please try again later.';
            console.log(response); // because we need to see what the server said somewhere.
        }
        const state =
          this.goodFeedback ?
            constants.MESSAGE_SUCCESS
          : constants.MESSAGE_ERROR;
        this.setMessage(mailMsg, state);
      });
    },
    pgBtnIsDisabled: function (key) {
      const pg = this.voucherPagination || {};
      if (
        pg.hasOwnProperty('first') &&
        pg.hasOwnProperty('last') &&
        pg.hasOwnProperty('current')
      ) {
        // check first and last aren't the same page
        if (pg.first.page !== pg.last.page) {
          switch (key) {
            case 'first':
              return pg[key].page === pg.current.page;
            case 'last':
              return pg[key].page === pg.current.page;
            default:
              return pg[key].url === '';
          }
        }
      }
      // tell it to disable.
      return true;
    },
    pageOfPages: function () {
      const pg = this.voucherPagination || {};
      return pg.hasOwnProperty('current') ?
          pg['current'].page + ' of ' + pg['last'].page
        : '';
    },
    pgChangePage: async function (event) {
      this.showSpinner();
      const key = event.target.id;
      const pg = this.voucherPagination || {};
      const page = pg.hasOwnProperty(key) ? pg[key].page : 1;
      await Store.getVoucherPaymentState(page);
      this.hideSpinner();
    }
  },
  mounted: async function () {
    this.showSpinner();
    await Store.getVoucherPaymentState();
    // TODO: Have a standard way of having global router messages.
    const message = this.$router.message;
    if (message) {
      this.setMessage(message.text, message.state);
      this.$router.message = {};
    }
    this.hideSpinner();
  }
};
</script>
