import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';


// api call from frontend to backend and backenf to database
// req = this will provide request body from frontend
// res = response will going to send back tp the frontend

// register user authentication
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
        } = req.body;

        // bcrypt the password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            // same naming convention key value that' why only stored only one name
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            // giving some random dummy value
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });
        const savedUser = await newUser.save();
        // after save data from can receive this response
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// logging  authentication
export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) return res.status(400).json({ msg: "User does not exist. " });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      delete user.password;
      res.status(200).json({ token, user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// authentication  - when register and login is authentication
// authorization - when someone is already login than only can perform some action is authorization
// eg- only when user login than only can get list of friend/ post