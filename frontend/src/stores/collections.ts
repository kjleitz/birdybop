import { uniqInPlace } from "@/lib/utils";
import type Comment from "@/types/Comment";
import type JsonApi from "@/types/JsonApi";
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
    addToCollection<T extends CollectionItem>(resourceData: T | T[], toKey = (item: T) => item.id): void {
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
        // const collection = collections[itemType] as CollectionItem[];
        const collection = collections[itemType] as T[];
        // uniqInPlace(collection, item => item.id, true);
        uniqInPlace(collection, toKey, true);
      });
    },

    // replaceInCollection(resourceData: CollectionItem, toKey = (item: CollectionItem) => item.id): void {
    //   if (!resourceData) return;

    //   const collection = this.collections[resourceData.type];
    //   const dataKey = toKey(resourceData);
    //   const itemIndex = collection.findIndex((item) => toKey(item) === dataKey);
    //   collection.splice(itemIndex, 1, resourceData);
    // },

    clearCollection(collectionType: CollectionType): void {
      this.collections[collectionType] = [];
    },
  },
});
