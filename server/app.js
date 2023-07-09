const express = require("express");
const cors = require("cors");
const ticketRoute = require("./routes/index");
const ticketSchema = require("./models/TicketModel");
const configSetting = require("./config/config");
const app = express();
app.use(
  cors({
    credentials: true,
    origin: configSetting.frontEndUrl,
  })
);
// app.use(cors());
app.use(express.json());
app.use(ticketRoute);

const mongoose = require("mongoose");
const config = {
  autoIndex: true,
  useNewUrlParser: true,
  dbName: "mongodbDatabase",
};

const connectionString = "mongodb://localhost:27018";
mongoose
  .connect(connectionString, config)
  .then(() => {
    console.log("Connected to Mongo DB...");
  })
  .catch((err) => {
    console.log("Error", err);
  });

// const deleteAllCollection = async () => {
//   try {
//     await ticketSchema.deleteMany();
//     console.log("All Data successfully deleted");
//   } catch (err) {
//     console.log(err);
//   }
// };

// deleteAllCollection();

const port = process.env.port || 3003;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
