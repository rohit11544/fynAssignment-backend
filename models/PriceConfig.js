import mongoose from "mongoose";

const pricingConfigSchema = mongoose.Schema({
    configID: Number,
    lowerRange: Number,
    upperRange: Number,
    price: Number,
    dayOfWeek: Number
});

const PricingConfigDetails = mongoose.model("PricingConfigDetails", pricingConfigSchema);

export default PricingConfigDetails;