import { DataTypes } from "sequelize";
import { db } from "../db/index.js";
import Thread from "./thread.js";

const Requests = db.define("Requests", {
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
  title: { type: DataTypes.STRING, allowNull: false },
  requirements: { type: DataTypes.STRING, allowNull: false },
  budget: { type: DataTypes.STRING, allowNull: false },
  delivery: { type: DataTypes.STRING, allowNull: false },
  payment: { type: DataTypes.STRING, allowNull: false },
  otherTerms: { type: DataTypes.STRING },
  status: {
    type: DataTypes.ENUM("PENDING", "ACCEPTED", "REJECTED"),
    allowNull: false,
  },
});

export default Requests;
