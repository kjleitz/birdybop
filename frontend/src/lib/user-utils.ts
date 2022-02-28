import { sequentialId } from "@/lib/utils";
import type User from "@/types/User";

export function createBlankUser(attributes: Partial<User["attributes"]> = {}): User {
  return {
    id: sequentialId("blankUser"),
    type: "user",
    attributes: {
      username: "",
      bio: "",
      role: "peasant",
      createdAt: new Date().toJSON(),
      updatedAt: new Date().toJSON(),
      ...attributes,
    },
    relationships: undefined,
    links: undefined,
    meta: undefined,
  };
}
