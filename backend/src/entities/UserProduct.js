import { EntitySchema } from "typeorm";

const UserProduct = new EntitySchema({
  name: "UserProduct",
  tableName: "user_products",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    quantity: {
      type: "int",
      default: 1
    }
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "user_id" },
      inverseSide: "userProducts",
      onDelete: "CASCADE"
    },
    product: {
      type: "many-to-one",
      target: "Product",
      joinColumn: { name: "product_id" },
      inverseSide: "userProducts",
      onDelete: "CASCADE"
    }
  }
});

export default UserProduct;
