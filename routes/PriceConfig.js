import express from "express";

import {
    getPricingConfig,
    createPricingConfig,
    updatePricingConfig,
    deletePricingConfig,
} from "../controllers/PriceConfig.js";

const router = express.Router();

router.get("/", getPricingConfig);
router.post("/", createPricingConfig);
router.patch("/:id", updatePricingConfig);
router.delete("/:id", deletePricingConfig);

export default router;