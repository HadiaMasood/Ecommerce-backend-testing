import { EntitySchema } from "typeorm";

const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    name: {
      type: "varchar"
    },
    email: {
      type: "varchar",
      unique: true
    },
    age: {
      type: "int",
      nullable: true
    },
    password: {
      type: "varchar",
      nullable: true
    },
    role: {
      type: "varchar",
      default: "user"
    },
    refreshToken: {
      type: "varchar",
      nullable: true
    }
  },
  relations: {
    userProducts: {
      type: "one-to-many",
      target: "UserProduct",
      inverseSide: "user"
    }
  }
});

export default User;