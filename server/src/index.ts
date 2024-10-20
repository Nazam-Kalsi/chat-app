import { server, io } from "./app";
import dbConnect from "./db/db";
import dotenv from "dotenv";
import {socketEvents} from "./socket/s"
dotenv.config();

const port = process.env.PORT || 3000;

dbConnect().then(() => {
  server.on("error", (error) => {
    console.log(error);
  });
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    socketEvents(io);
  });
})
.catch(err => console.log(err));

