import express from "express";
import AdminDetails from "../models/Admin.js";

const router = express.Router();

export const adminLogin = async (req, res) => {
    const document = await AdminDetails.findOne({ email: req.params.email, password: req.params.password });
    if (document) {
        res.status(200).json({ message: document.email });
    } else {
        res.status(200).json({ message: "NO MATCH" });
    }
};

router.get("/:email/:password", adminLogin);

export default router;