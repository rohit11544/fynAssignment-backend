import mongoose from "mongoose";

const raidSchema = mongoose.Schema({
  date: String,
  price: Number,
  dayOfMonth: Number,
  monthOfYear: Number,
  year: Number,
});

const RaidDetails = mongoose.model("raidDetails", raidSchema);

export default RaidDetails;
