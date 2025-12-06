import { Sequelize } from "sequelize";
import { config } from "dotenv";

config();
const DB = process.env.DB_URL;
if (!DB) {
  throw new Error("DB_URL is not defined");
}

export function registerShutdown() {
  ["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
    process.on(signal, (e) => db.close().then(() => process.exit(0)));
  });

  process.on("beforeExit", () => db.close());
}

export const db = new Sequelize(DB);
