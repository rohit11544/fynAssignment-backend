import express from "express";
import RaidDetails from "../models/Raid.js";
import mongoose from "mongoose";

const router = express.Router();

export const getRaidDetails = async (req, res) => {
  try {
    const raidDetails = await RaidDetails.find();
    res.status(200).json(raidDetails);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const getPriceOfMonth = async (req, res) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  try {
    // const db = client.db(dbName);
    // const collection = db.collection("raiddetails");

    // Aggregation pipeline
    const pipeline = [
      {
        $group: {
          _id: "$monthOfYear",
          totalPrice: { $sum: "$price" },
        },
      },
    ];

    // Execute the aggregation query
    RaidDetails.aggregate(pipeline).exec(function (err, result) {
      if (err) {
        console.error("Error executing aggregation:", err);
        mongoose.connection.close();
        return;
      }

      // Format the result into an object (dictionary) with month names
      const formattedResult = {};
      result.forEach((entry) => {
        const monthName = monthNames[entry._id];
        formattedResult[monthName] = entry.totalPrice;
      });

      console.log(formattedResult);
      res.json(formattedResult);
      // Close the connection
      // mongoose.connection.close();
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const getPriceOfYear = async (req, res) => {
  try {
    // Aggregation pipeline
    const pipeline = [
      {
        $group: {
          _id: "$year", // Assuming the year field is named 'year'
          totalPrice: { $sum: "$price" },
        },
      },
    ];

    // Execute the aggregation query
    RaidDetails.aggregate(pipeline).exec(function (err, result) {
      if (err) {
        console.error("Error executing aggregation:", err);
        mongoose.connection.close();
        return;
      }

      // Format the result into a dictionary with years as keys and total prices as values
      const formattedResult = {};
      result.forEach((entry) => {
        formattedResult[entry._id] = entry.totalPrice;
      });
      console.log(formattedResult);
      res.json(formattedResult);
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

router.get("/", getRaidDetails);
router.get("/getPriceOfMonth", getPriceOfMonth);
router.get("/getPriceOfYear", getPriceOfYear);

export default router;
