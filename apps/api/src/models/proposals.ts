import { DataTypes } from "sequelize";
import { db } from "../db/index.js";
import { Vendors } from "./vendors.js";

export const Proposal = db.define("Proposals", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV1,
  },
  vendorId: { type: DataTypes.UUID, allowNull: false },
  requestId: { type: DataTypes.UUID, allowNull: false },
  requirements: { type: DataTypes.STRING, allowNull: false },
  budget: { type: DataTypes.STRING, allowNull: false },
  delivery: { type: DataTypes.STRING, allowNull: false },
  payment: { type: DataTypes.STRING, allowNull: false },
  otherTerms: { type: DataTypes.STRING, allowNull: false },
});

Proposal.belongsTo(Vendors, { foreignKey: "vendorId" });
