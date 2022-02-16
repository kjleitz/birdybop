import { search } from "@/api/searchService";
import { useCollectionsStore } from "@/stores/collections";
import { defineStore } from "pinia";

export const useSearchStore = defineStore("search", {
  state: () => ({
    query: "",
    searching: false,
  }),

  actions: {
    setQuery(query: string): void {
      this.query = query;
    },

    setSearching(searching: boolean): void {
      this.searching = searching;
    },

    search(query: string): Promise<void> {
      const q = query.trim();
      this.setQuery(q);
      this.setSearching(true);
      const collectionsStore = useCollectionsStore();
      collectionsStore.clearCollection("searxResult");
      return search(q).then((results) => {
        // TODO: This, but for the other API calls
        const { data, included } = results;
        collectionsStore.addToCollection(data);
        if (included) collectionsStore.addToCollection(included);
      }).finally(() => {
        this.setSearching(false);
      });
    },
  },
});
