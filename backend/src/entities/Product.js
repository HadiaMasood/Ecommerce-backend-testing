import { EntitySchema } from "typeorm";

const Product = new EntitySchema({
  name: "Product",
  tableName: "products",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    name: {
      type: "varchar"
    },
    price: {
      type: "decimal",
      precision: 10,
      scale: 2
    }
  },
  relations: {
    userProducts: {
      type: "one-to-many",
      target: "UserProduct",
      inverseSide: "product"
    }
  }
});

export default Product;
