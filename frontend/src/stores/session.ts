import { createSession, deleteSession, refreshSession, type SessionCreateParams } from "@/api/sessionService";
import { createBlankUser } from "@/lib/user-utils";
import { useCollectionsStore } from "@/stores/collections";
import { useUserStore } from "@/stores/user";
import { defineStore } from "pinia";

export const useSessionStore = defineStore("session", {
  state: () => ({
    creatingSession: false,
    refreshingSession: false,
    deletingSession: false,
  }),

  getters: {
    isLoggedIn: () => useUserStore().isLoggedIn,
  },

  actions: {
    setCreatingSession(creatingSession: boolean): void {
      this.creatingSession = creatingSession;
    },

    setRefreshingSession(refreshingSession: boolean): void {
      this.refreshingSession = refreshingSession;
    },

    setDeletingSession(deletingSession: boolean): void {
      this.deletingSession = deletingSession;
    },

    createSession(params: SessionCreateParams): Promise<void> {
      this.setCreatingSession(true);
      const collectionsStore = useCollectionsStore();
      const userStore = useUserStore();
      return createSession(params).then((user) => {
        userStore.setUser(user);
        collectionsStore.addToCollection(user);
      }).finally(() => {
        this.setCreatingSession(false);
      });
    },

    refreshSession(): Promise<void> {
      this.setRefreshingSession(true);
      const collectionsStore = useCollectionsStore();
      const userStore = useUserStore();
      return refreshSession().then((user) => {
        userStore.setUser(user);
        collectionsStore.addToCollection(user);
      }).finally(() => {
        this.setRefreshingSession(false);
      });
    },

    deleteSession(): Promise<void> {
      this.setDeletingSession(true);
      const userStore = useUserStore();
      return deleteSession().then(() => {
        userStore.setUser(createBlankUser());
      }).finally(() => {
        this.setDeletingSession(false);
      });
    },
  },
});
