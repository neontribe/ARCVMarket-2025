import { defineStore } from 'pinia';

const userDefault = {
  id: null,
  traders: []
};

export const useUserStore = defineStore('user', {
  state: () => ({
    user: userDefault,
  }),
  actions: {
    setUserTraders(traders) {
      this.user.traders = traders;
    },
    resetUser() {
      this.user = userDefault;
    }
  }
});
