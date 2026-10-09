import { CollectionConfig } from "payload/types";
import { GiftCards as GiftCard } from "../pages/gift_cards";

const GiftCards: CollectionConfig = {
  slug: "gift-cards",
  labels: {
    singular: "Gift Cards",
    plural: "Gift Cards",
  },
  admin: {
    components: {
      views: {
        List: GiftCard,
      },
    },
  },
  access: {
    read: ({ req: { user } }) =>
      user.roles.includes("manager") || user.roles.includes("admin"),
    create: ({ req: { user } }) =>
      user.roles.includes("manager") || user.roles.includes("admin"),
    update: ({ req: { user } }) =>
      user.roles.includes("manager") || user.roles.includes("admin"),
    delete: ({ req: { user } }) =>
      user.roles.includes("manager") || user.roles.includes("admin"),
  },
  fields: [],
};

export default GiftCards;
