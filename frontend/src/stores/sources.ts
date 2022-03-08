import { createSource, fetchSource, fetchSources, type SourceCreateParams } from "@/api/sourceService";
import { encodeUriComponentBase64 } from "@/lib/encoding-utils";
import { useCollectionsStore } from "@/stores/collections";
import { defineStore } from "pinia";

export const useSourcesStore = defineStore("sources", {
  state: () => ({
    loadingSource: false,
    loadingSources: false,
    creatingSource: false,
  }),

  actions: {
    setLoadingSource(loadingSource: boolean): void {
      this.loadingSource = loadingSource;
    },

    setLoadingSources(loadingSources: boolean): void {
      this.loadingSources = loadingSources;
    },

    setCreatingSource(creatingSource: boolean): void {
      this.creatingSource = creatingSource;
    },

    fetchSources(): Promise<void> {
      this.setLoadingSources(true);
      const collectionsStore = useCollectionsStore();
      return fetchSources().then((sources) => {
        collectionsStore.addToCollection(sources, source => source.attributes.path);
      }).finally(() => {
        this.setLoadingSources(false);
      });
    },

    fetchSource(path: string, fullUrl?: string): Promise<void> {
      this.setLoadingSource(true);
      const encodedSourcePath = encodeUriComponentBase64(path);
      const encodedSourceUrl = fullUrl ? encodeUriComponentBase64(fullUrl) : "";
      const collectionsStore = useCollectionsStore();
      return fetchSource(encodedSourcePath, encodedSourceUrl).then((source) => {
        collectionsStore.addToCollection(source, source => source.attributes.path);
      }).finally(() => {
        this.setLoadingSource(false);
      });
    },

    createSource(params: SourceCreateParams): Promise<void> {
      this.setCreatingSource(true);
      const collectionsStore = useCollectionsStore();
      return createSource(params).then((source) => {
        collectionsStore.addToCollection(source, source => source.attributes.path);
      }).finally(() => {
        this.setCreatingSource(false);
      });
    },
  },
});
