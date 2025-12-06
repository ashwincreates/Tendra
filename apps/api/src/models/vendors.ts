import { DataTypes } from "sequelize";
import { db } from "../db/index.js";
import { Proposal } from "./proposals.js";

export const Vendors = db.define("Vendors", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV1,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
