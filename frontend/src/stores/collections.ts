import { uniqInPlace } from "@/lib/utils";
import type Comment from "@/types/Comment";
import type CommentVote from "@/types/CommentVote";
import type SearxResult from "@/types/SearxResult";
import type Source from "@/types/Source";
import type User from "@/types/User";
import { defineStore } from "pinia";

interface Collections {
  comment: Comment[];
  searxResult: SearxResult[];
  source: Source[];
  user: User[];
  commentVote: CommentVote[];
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
      commentVote: [],
    },
  }),

  actions: {
    addToCollection<T extends CollectionItem>(resourceData: T | T[], toKey = (item: T) => item.id, prepend = false): void {
      if (!resourceData) return;

      const collections = this.collections;
      const types = new Set<CollectionType>();

      const addResource = <T extends CollectionType, I extends CollectionItem<T>>(item: I): void => {
        types.add(item.type);
        const collection = collections[item.type] as I[];
        if (prepend) {
          collection.unshift(item);
        } else {
          collection.push(item);
        }
      };

      if (Array.isArray(resourceData)) {
        resourceData.forEach(item => addResource(item));
      } else {
        addResource(resourceData);
      }

      types.forEach((itemType) => {
        const collection = collections[itemType] as T[];
        uniqInPlace(collection, toKey, !prepend);
      });
    },

    removeFromCollection<T extends CollectionItem>(resourceData: T | T[], toKey = (item: T) => item.id): void {
      const collections = this.collections;

      const removeResource = (item: T): void => {
        const collection = collections[item.type] as T[];
        const itemKey = toKey(item);
        const removalIndex = collection.findIndex((resource) => toKey(resource) === itemKey);
        collection.splice(removalIndex, 1);
      };

      if (Array.isArray(resourceData)) {
        resourceData.forEach(item => removeResource(item));
      } else {
        removeResource(resourceData);
      }
    },

    removeFromCollectionByKey<T extends CollectionType>(collectionType: T, key: number | string | (number | string)[], toKey = (item: CollectionItem<T>) => item.id): void {
      const collection = this.collections[collectionType];

      const removeResource = (itemKey: number | string): void => {
        const stringKey = `${itemKey}`;
        const removalIndex = collection.findIndex((resource) => toKey(resource) === stringKey);
        collection.splice(removalIndex, 1);
      };

      if (Array.isArray(key)) {
        key.forEach(itemKey => removeResource(itemKey));
      } else {
        removeResource(key);
      }
    },

    clearCollection(collectionType: CollectionType): void {
      this.collections[collectionType] = [];
    },
  },
});
