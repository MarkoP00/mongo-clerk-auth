import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  clerkUserId: { type: String, unique: true, sparse: true }, //storaging id of clerk users (for later) / clerk users do not have password, and I will use clerkUserId instad of it
  userId: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  username: {
    type: String,
    required: true,
    unique: false,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.clerkUserId; //password required if user register manually
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// add method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
