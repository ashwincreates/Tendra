import express from "express";
import figlet from "figlet";
import morgan from "morgan";
import cors from "cors";
import { config } from "dotenv";

config();

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT || 3000, () => {
  console.log(
    figlet.textSync("Tendra", {
      horizontalLayout: "full",
      font: "3D-ASCII",
    }),
  );
});
