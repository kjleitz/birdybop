import User from "@/types/User";

export function createBlankUser(attributes: Partial<User["attributes"]> = {}): User {
  return {
    id: "0",
    type: "user",
    attributes: {
      username: "",
      bio: "",
      role: "peasant",
      createdAt: new Date().toJSON(),
      updatedAt: new Date().toJSON(),
      ...attributes,
    },
  };
}
