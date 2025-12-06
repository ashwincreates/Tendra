import { DataTypes } from "sequelize";
import { db } from "../db/index.js";
import Thread from "./thread.js";

export const Messages = db.define("Messages", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV1,
  },
  threadId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Thread,
      key: "id",
    },
  },
  role: {
    type: DataTypes.ENUM("user", "ai"),
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
