import { User } from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { generateTokenAndSetCookie } from '../util/libs/generateTokenandSet.js';

export const signup = async (req, res) => {
    const { email, password, name } = req.body;
    console.log('Signup request body:', req.body);

    try {
        if (!email || !password || !name) {
            console.log('Missing fields');
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        if (password.length < 8) {
            console.log('Password too short');
            return res.status(400).json({
                error: "Password must be at least 8 characters"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('Invalid email format');
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        const userExists = await User.findOne({ email });
        console.log('User exists check:', userExists);
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashPassword = await bcryptjs.hash(password, 10);
        console.log('Password hashed');

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        console.log('Verification code generated:', verificationToken);

        const newUser = new User({
            name,
            email,
            password: hashPassword,
            verificationToken,
            verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000//24 hours
        });

        console.log('New user object:', newUser);

        await newUser.save();
        console.log('User saved');

       //jwt and cookie 

       generateTokenAndSetCookie(res,newUser._id);
       res.status(201).json({
        success:true,
        message:"User registered successfully",

        user:{
            ...newUser._doc,
            password:undefined,
            verificationToken:undefined,
            verificationTokenExpires:undefined

        }
       })


    } catch (error) {
        console.log('Error in signup:', error);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log('Login request body:', req.body);

    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = generateverificationCode(req, res, user._id);
        console.log('Token generated:', token);

        user.lastLogin = new Date();
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (error) {
        console.log('Error in login:', error);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        console.log('Error in logout:', error);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
