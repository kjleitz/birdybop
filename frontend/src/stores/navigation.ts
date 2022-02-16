import { defineStore } from "pinia";

export const useNavigationStore = defineStore("navigation", {
  state: () => ({
    intendedDestination: "",
  }),

  actions: {
    setIntendedDestination(intendedDestination: string): void {
      this.intendedDestination = intendedDestination;
    },

    clearIntendedDestination(): void {
      this.intendedDestination = "";
    },
  },
});
