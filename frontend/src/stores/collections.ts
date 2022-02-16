import { uniqInPlace } from "@/lib/utils";
import type Comment from "@/types/Comment";
import type SearxResult from "@/types/SearxResult";
import type Source from "@/types/Source";
import type User from "@/types/User";
import { defineStore } from "pinia";

interface Collections {
  comment: Comment[];
  searxResult: SearxResult[];
  source: Source[];
  user: User[];
}

type CollectionType = keyof Collections;
type Collection<T extends CollectionType = CollectionType> = { [P in CollectionType]: Collections[P] }[T];
type CollectionItem<T extends CollectionType = CollectionType> = Collection<T>[number];

export const useCollectionsStore = defineStore("collections", {
  state: (): { collections: Collections } => ({
    collections: {
      comment: [],
      searxResult: [],
      source: [],
      user: [],
    },
  }),

  actions: {
    addToCollection(resourceData: CollectionItem | CollectionItem[]): void {
      if (!resourceData) return;

      const collections = this.collections;
      const types = new Set<CollectionType>();

      const addResource = <T extends CollectionType, I extends CollectionItem<T>>(item: I): void => {
        types.add(item.type);
        const collection = collections[item.type] as I[];
        collection.push(item);
      };

      if (Array.isArray(resourceData)) {
        resourceData.forEach(item => addResource(item));
      } else {
        addResource(resourceData);
      }

      types.forEach((itemType) => {
        const collection = collections[itemType] as CollectionItem[];
        uniqInPlace(collection, item => item.id);
      });
    },

    clearCollection(collectionType: CollectionType): void {
      this.collections[collectionType] = [];
    },
  },
});
