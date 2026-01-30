import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET;

const createToken = async (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "24h" });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // validation all fields
  if (!name || !email || !password) {
    return res.status(400).res.json({
      success: false,
      message: "All field are required",
    });
  }
  // Email Validate
  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .res.json({ success: false, message: "Invalid Email" });
  }

  // password validate
  if (password.length < 8) {
    return res.status(409).res.json({
      success: false,
      message: "Password must be at least 8 character",
    });
  }

  // try catch
  try {
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      return res
        .status(409)
        .json({ success: false, message: "user Already exits" });
    }
    // password hashed
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    // token
    const token = createToken(user._id);

    return res.status(201).json({
      success: true,
      message: "User Created Successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server Error! Something went wrong!!!",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and Password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials" });
    }
    // matched password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Password does not match" });
    }

    const token = createToken(user._id);

    return res.status(201).json({
      success: true,
      message: "User Login Successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server Error! User Login failed. Something went wrong!!!",
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id).select("name email");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    return res.status(201).json({
      success: true,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server Error! User Login failed. Something went wrong!!!",
    });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || !validator.isEmail(email)) {
    return res
      .status(409)
      .json({ success: false, message: "Valid name and email required" });
  }
  try {
    const exists = await User.findOne({ email, _id: { $ne: req.user.id } });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Email already user try another email",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true, select: "name email" },
    );

    return res.status(201).json({
      success: true,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server Error! User Login failed. Something went wrong!!!",
    });
  }
};

// update Password
const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return res
      .status(400)
      .json({ success: false, message: "Password invalid or too short!" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res
        .status(400)
        .json({ success: false, message: "Current password incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Password Changed",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server Error! User Login failed. Something went wrong!!!",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  updatePassword,
};
