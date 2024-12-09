import { defineStore } from 'pinia';

export const useNetworkStore = defineStore('network', {
  state: () => ({
    netMgr: null // Inject NetMgr in app setup
  }),
  actions: {
    setNetMgr(manager) {
      this.netMgr = manager;
    },
    async apiPost(url, data, success, failure) {
      try {
        const response = await this.netMgr.apiPost(url, data);
        success?.(response);
      } catch (error) {
        failure?.(error);
      }
    },
    async apiGet(url, success, failure) {
      try {
        const response = await this.netMgr.apiGet(url);
        success?.(response);
      } catch (error) {
        failure?.(error);
      }
    }
  }
});
