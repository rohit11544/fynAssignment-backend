import mongoose from "mongoose";
import PricingConfigDetails from "../models/PriceConfig.js";

export const getPricingConfig = async (req, res) => {
    try {
        const pricingConfigDetails = await PricingConfigDetails.find();
        res.status(200).json(pricingConfigDetails);
    } catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
};

export const createPricingConfig = async (req, res) => {
    const pricingConfig = req.body;

    const newPricingConfig = new PricingConfigDetails(pricingConfig);
    try {
        await newPricingConfig.save();

        res.status(201).json(newPricingConfig);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const updatePricingConfig = async (req, res) => {
    const { id: id } = req.params;
    const pricingConfig = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send("No pricingConfig with that id");
    }

    const updatedPricingConfig = await PricingConfigDetails.findByIdAndUpdate(id, { ...pricingConfig });
    res.json(updatedPricingConfig);
};

export const deletePricingConfig = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send("No pricingConfig with that id");
    }

    await PricingConfigDetails.findByIdAndRemove(id);

    res.json({ message: "Shop deleted successfully" });
};