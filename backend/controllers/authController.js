import User from "../server/models/userSchema.js";
import jwt from "jsonwebtoken";

//helper function - generate jwt
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

//register
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    const usernameInUse = await User.findOne({ username });

    // check
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    if (usernameInUse)
      return res.status(400).json({ message: "Username already taken" });

    // create user
    let user = new User({ username, email, password });

    await user.save();

    res.status(201).json({ messsage: "User created successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error while registering. Error: ${error.message}` });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // clerk user - no password
    if (!user.password) {
      return res.status(400).json({
        message: "This account uses social login. Please sign in with Clerk.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, username: user.username },
      message: "Ok",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
