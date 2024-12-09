import { defineStore } from "pinia";

const traderDefault = {
    id: null,
    pendedVouchers: [],
    vouchers: [],
    recVouchers: [],
    market: {
      payment_message: "",
      sponsor_shortcode: "",
    },
  };

export const useTraderStore = defineStore("trader", {
  state: () => ({
    trader: traderDefault,
    pendedVoucherPagination: {},
    gettingRecVouchers: 0,
  }),
  actions: {
    resetTrader() {
      this.trader = traderDefault;
      this.pendedVoucherPagination = {};
    },
    getTraderVoucherList() {
      return this.trader.vouchers.map((v) => v.code);
    },
    mergeRecVouchers(replacements) {
      this.trader.recVouchers = [...replacements];
    },
    clearVouchers() {
      this.trader.vouchers = [];
    },
  },
});
