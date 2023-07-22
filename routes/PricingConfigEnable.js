import express from "express";
import PriceConfigEnableDetails from "../models/PricingConfigEnable.js";

const router = express.Router();

export const enableConfig = async (req, res) => {
  let document = await PriceConfigEnableDetails.findOne({
    _id: req.params.id,
  });
  if (document) {
    const priceConfigEnableDetails =
      await PriceConfigEnableDetails.findByIdAndUpdate(document._id, {
        enable: !document.enable,
        configID: document.configID,
        name: document.name,
      });
    res.json(priceConfigEnableDetails);
  } else {
    res.json({});
  }
};

export const getPricingConfigEnable = async (req, res) => {
  try {
    const priceConfigEnableDetails = await PriceConfigEnableDetails.find();
    res.status(200).json(priceConfigEnableDetails);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

router.get("/", getPricingConfigEnable);
router.get("/:id", enableConfig);

export default router;
