import express from "express";
import figlet from "figlet";
import morgan from "morgan";
import cors from "cors";
import { db, registerShutdown } from "./db/index.js";
import threadRouter from "./routes/thread.js";
import queryRouter from "./routes/query.js";
import vendorsRouter from "./routes/vendors.js";
import webhookRouter from "./routes/webhooks.js";
import requestRouter from "./routes/request.js";
import proposalRouter from "./routes/proposals.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/thread", threadRouter);
app.use("/query", queryRouter);
app.use("/vendors", vendorsRouter);
app.use("/webhooks", webhookRouter);
app.use("/requests", requestRouter);
app.use("/proposals", proposalRouter);

registerShutdown();
db.authenticate()
  .then(async () => {
    await db.sync();
    app.listen(process.env.PORT || 8080, () => {
      console.log(
        figlet.textSync("Tendra", {
          horizontalLayout: "full",
          font: "3D-ASCII",
        }),
      );
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
