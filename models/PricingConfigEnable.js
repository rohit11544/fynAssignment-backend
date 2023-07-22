import mongoose from "mongoose";

const pricingConfigEnableSchema = mongoose.Schema({
  configID: Number,
  name: String,
  enable: Boolean,
});

const PricingConfigEnableDetails = mongoose.model(
  "PricingConfigEnableDetails",
  pricingConfigEnableSchema
);

export default PricingConfigEnableDetails;
