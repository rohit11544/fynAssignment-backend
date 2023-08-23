import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import adminRoutes from "./routes/Admin.js";
import configEnableRouts from "./routes/PricingConfigEnable.js";
import PriceConfigRouts from "./routes/PriceConfig.js";
import RaidRouts from "./routes/Raid.js";
import PriceConfigEnableDetails from "./models/PricingConfigEnable.js";
import PriceConfigDetails from "./models/PriceConfig.js";

// creating app
const app = express();

app.use(
  bodyParser.json({
    limit: "30mb",
    extended: true,
  })
);

app.use(
  bodyParser.urlencoded({
    limit: "30mb",
    extended: true,
  })
);

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello and welcome to FYN website!!!");
});

app.use("/admin", adminRoutes);
app.use("/configEnable", configEnableRouts);
app.use("/priceConfig", PriceConfigRouts);
app.use("/raid", RaidRouts);

// API to calculate the price
app.use("/price/:distance/:time", async (req, res) => {
  let distance = parseInt(req.params.distance);
  let time = parseInt(req.params.time);
  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay();

  // base price
  let priceDBP = 0;
  const documentDBP = await PriceConfigEnableDetails.findOne({ configID: 1 });
  if (documentDBP) {
    if (documentDBP.enable === true) {
      const documentDBPs = await PriceConfigDetails.findOne({
        configID: 1,
        dayOfWeek: dayOfWeek,
      });
      if (documentDBPs && distance <= documentDBPs.upperRange) {
        priceDBP = documentDBPs.price;
        distance = distance - documentDBPs.upperRange;
      }
    }
  }
  // console.log("priceDBP " + priceDBP);

  // addition distance price
  let priceDAP = 0;
  const documentDAP = await PriceConfigEnableDetails.findOne({ configID: 2 });
  if (documentDAP) {
    if (documentDAP.enable === true && distance > 0) {
      const documentDBPs = await PriceConfigDetails.find({
        configID: 2,
        dayOfWeek: dayOfWeek,
      }).exec();
      if (documentDBPs) {
        const tempArr = documentDBPs;
        tempArr.sort((a, b) => a.upperRange - b.upperRange);
        for (let i = 0; i < tempArr.length; i++) {
          if (distance > tempArr[i].upperRange) {
            priceDAP =
              priceDAP +
              (tempArr[i].upperRange - tempArr[i].lowerRange) *
                tempArr[i].price;
          } else {
            priceDAP =
              priceDAP + (distance - tempArr[i].lowerRange) * tempArr[i].price;
            break;
          }
        }
      }
    }
  }
  // console.log("priceDAP " + priceDAP);

  // Time Multiplier Factor TMP
  let priceTMF = 0;
  const documentTMF = await PriceConfigEnableDetails.findOne({ configID: 3 });
  if (documentTMF) {
    if (documentTMF.enable === true) {
      const documentTMFs = await PriceConfigDetails.find({
        configID: 3,
        dayOfWeek: dayOfWeek,
      }).exec();
      if (documentTMFs) {
        const tempArr = documentTMFs;
        tempArr.sort((a, b) => a.upperRange - b.upperRange);
        let tempTime = time;
        for (let i = 0; i < tempArr.length; i++) {
          if (tempTime > tempArr[i].upperRange) {
            priceTMF =
              priceTMF +
              (tempArr[i].upperRange - tempArr[i].lowerRange) *
                tempArr[i].price;
          } else {
            priceTMF =
              priceTMF + (tempTime - tempArr[i].lowerRange) * tempArr[i].price;
            break;
          }
        }
      }
    }
  }
  // console.log("priceTMF " + priceTMF);

  // Waiting cost WC
  let priceWC = 0;
  const documentWC = await PriceConfigEnableDetails.findOne({ configID: 4 });
  if (documentWC) {
    if (documentWC.enable === true) {
      const documentWCs = await PriceConfigDetails.find({
        configID: 4,
        dayOfWeek: dayOfWeek,
      }).exec();
      if (documentWCs) {
        const tempArr = documentWCs;
        tempArr.sort((a, b) => a.upperRange - b.upperRange);
        let tempTime = time;
        for (let i = 0; i < tempArr.length; i++) {
          if (tempTime > tempArr[i].upperRange) {
            priceWC =
              priceWC +
              (tempArr[i].upperRange - tempArr[i].lowerRange) *
                tempArr[i].price;
          } else {
            priceWC =
              priceWC + (tempTime - tempArr[i].lowerRange) * tempArr[i].price;
            break;
          }
        }
      }
    }
  }
  // console.log("priceWC " + priceWC);
  const totalPrice = priceDAP + priceDBP + priceTMF + priceWC;

  res.status(200).json({
    totalPrice: totalPrice,
    priceDAP: priceDAP,
    priceDBP: priceDBP,
    priceTMF: priceTMF,
    priceWC: priceWC,
  });
});

const CONNECTION_URL = process.env.MONGO_URL;

const PORT = process.env.PORT || 5000;

// connecting mongoDB to server
mongoose
  .connect(CONNECTION_URL)
  .then(() =>
    app.listen(PORT, () => console.log(`server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));
