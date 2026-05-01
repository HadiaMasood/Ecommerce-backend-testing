import { EntitySchema } from "typeorm";

const Result = new EntitySchema({
  name: "Result",
  tableName: "results",

  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    subject: {
      type: "varchar"
    },
    marks: {
      type: "int"
    },
    grade: {
      type: "varchar",
      nullable: true
    }
  },

  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "userId"
      },
      eager: true
    }
  }
});

export default Result;