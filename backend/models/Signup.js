import mongoose from "mongoose";

// user schema - name + password stored in mongo
const UserSChema = new mongoose.Schema({
  name: String,
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSChema);

export default User;
