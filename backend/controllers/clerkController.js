import { getAuth } from "@clerk/express";
import jwt from "jsonwebtoken";
import User from "../server/models/userSchema.js";

// helper function - generate jwt
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const syncClerkUser = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Look up by clerkUserId first
    let user = await User.findOne({ clerkUserId: userId });

    if (!user) {
      // fetch user details from Clerk
      const response = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      });

      if (!response.ok) {
        return res
          .status(500)
          .json({ message: "Failed to fetch user from Clerk." });
      }

      const clerkUser = await response.json();
      const email = clerkUser.email_addresses[0].email_address;

      // check if user exists in Mongo by email
      let existingUser = await User.findOne({ email });

      if (existingUser) {
        // link Clerk account to existing user
        existingUser.clerkUserId = userId;
        await existingUser.save();

        const token = generateToken(existingUser._id);

        return res.status(200).json({
          token,
          user: {
            id: existingUser._id,
            email: existingUser.email,
            username: existingUser.username,
            createdAt: existingUser.createdAt,
            userId: existingUser.userId,
          },
        });
      }

      // create a new Mongo user if none exists
      user = await User.create({
        clerkUserId: userId,
        username: `${clerkUser.first_name} ${clerkUser.last_name}`,
        email,
        imageUrl: clerkUser.image_url,
      });
    }

    // generate token for either new or existing user
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        userId: user.userId,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Error in syncClerkUser:", err);
    res.status(500).json({ message: err.message });
  }
};
