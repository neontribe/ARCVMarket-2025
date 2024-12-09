import { defineStore } from "pinia";

const queueDefault = {
    sendingStatus: false,
    sentData: null,
};

export const useQueueStore = defineStore("queue", {
    state: () => ({
        queue: {
            sendingStatus: false,
            sentData: null,
        },
    }),
    actions: {
        setSendingStatus(status) {
            this.queue.sendingStatus = status;
        },
        setSentData(data) {
            this.queue.sentData = data;
        },
        resetQueue() {
            this.queue = queueDefault;
        },
    },
});
