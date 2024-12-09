import { defineStore } from "pinia";
import { useUserStore } from "./user.pinia";
import { useTraderStore } from "./trader.pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    auth: false,
    error: null,
  }),
  actions: {
    async authenticate(userApiCredentials, success, failure, netMgr) {
      try {
        const response = await netMgr.apiPost("/login", userApiCredentials);
        netMgr.setToken(response.data);
        this.auth = true;
        success();
      } catch (error) {
        this.error = error.response?.status === 401 ? "Invalid Credentials" : "Unknown Error";
        failure?.(this.error);
      }
    },
    unAuthenticate(success, failure, netMgr) {
      netMgr.apiPost(
        "/logout",
        null,
        (response) => {
          this.auth = false;
          const userStore = useUserStore();
          const traderStore = useTraderStore();
          userStore.resetUser();
          traderStore.resetTrader();
          netMgr.setToken(null);
          success?.(response);
        },
        failure
      );
    },
    resetError() {
      this.error = null;
    },
  },
});
