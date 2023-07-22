import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
  email: String,
  password: String,
});

const AdminDetails = mongoose.model("AdminDetails", adminSchema);

export default AdminDetails;
