import { DataTypes } from "sequelize";
import { db } from "../db/index.js";

const Thread = db.define("Thread", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV1,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Thread;
