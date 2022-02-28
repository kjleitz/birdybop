import { keepSessionAlive } from "@/api/sessionService";
import { createUser, type UserCreateParams } from "@/api/userService";
import { createBlankUser } from "@/lib/user-utils";
import { useCollectionsStore } from "@/stores/collections";
import type User from "@/types/User";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: createBlankUser(),
    creatingUser: false,
  }),

  getters: {
    isLoggedIn: state => parseInt(state.user.id, 10) > 0,
  },

  actions: {
    setUser(user: User): void {
      this.user = user;
    },

    setCreatingUser(creatingUser: boolean): void {
      this.creatingUser = creatingUser;
    },

    createUser(params: UserCreateParams): Promise<void> {
      this.setCreatingUser(true);
      const collectionsStore = useCollectionsStore();
      return createUser(params).then((user) => {
        this.setUser(user);
        collectionsStore.addToCollection(user);
        keepSessionAlive();
      }).finally(() => {
        this.setCreatingUser(false);
      });
    },
  },
});
