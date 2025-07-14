import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // Built-in Node.js module
import sendEmail from '../utils/sendEmail';

/**
 * @desc    Helper function to generate a JSON Web Token
 * @param   id The user's MongoDB document ID
 * @returns A signed JWT string
 */
const generateToken = (id: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables.');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token will expire in 30 days
  });
};


// --- AUTHENTICATION FLOWS ---

/**
 * @desc    Register a user with email & password, then send OTP.
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    // Manually validate password since it's not required at the schema level
    if (!password || password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters long.' });
      return;
    }

    const existingUser = await User.findOne({ email });

    // If a user with this email already exists and is verified, deny registration
    if (existingUser && existingUser.isVerified) {
       res.status(400).json({ message: 'This email is already registered.' });
       return
    }

    // Use the existing unverified user or create a new one
    const user = existingUser || new User({ name, email, password });
    if (!existingUser) {
      user.password = password; // Set password for new user; pre-save hook will hash it
    }

    // Generate and save a new OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
    user.isVerified = false;

    await user.save();

    // Send the OTP to the user's email
    await sendEmail({
      email: user.email,
      subject: 'Your Account Verification Code',
      html: `
        <h1>Email Verification</h1>
        <p>Thank you for registering. Your verification code is: <strong>${otp}</strong>.</p>
        <p>This code will expire in 10 minutes.</p>
      `,
    });

    res.status(201).json({ message: 'Registration successful. Please check your email for an OTP.' });

  } catch (error: any) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
};


/**
 * @desc    Verify the email OTP, mark user as verified, and log them in.
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;
  try {
    // Find user by email with a matching, non-expired OTP
    const user = await User.findOne({ 
      email, 
      otp, 
      otpExpires: { $gt: Date.now() } 
    });

    if (!user) {
       res.status(400).json({ message: 'Invalid OTP or the OTP has expired.' });
    return;
    }

    // OTP is correct, so update user's status
    user.isVerified = true;
    user.otp = undefined; // Clear OTP fields for security
    user.otpExpires = undefined;
    await user.save();

    // User is now verified, log them in by sending a token
    res.status(200).json({
      message: 'Account verified successfully.',
      token: generateToken(user.id),
    });

  } catch (error: any) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({ message: 'Server error during OTP verification.', error: error.message });
  }
};


/**
 * @desc    Log in a user with their email and password.
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
       res.status(401).json({ message: 'Invalid credentials.' });
       return
    }

    // Check if the account has been verified
    if (!user.isVerified) {
       res.status(403).json({ message: 'Your account has not been verified. Please check your email.' });
       return
    }
    
    // Check if the user signed up with a social provider (like Google)
    if (!user.password) {
       res.status(401).json({ message: 'This account was registered using a social provider. Please sign in with Google.' });
       return
    }

    // Compare the provided password with the stored hashed password
    if (await user.comparePassword(password)) {
      res.status(200).json({
        message: "Login successful!",
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials.' });
    }
    
  } catch (error: any) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
};


/**
 * @desc    Handle the initial "forgot password" request.
 * @route   POST /api/auth/forgot-password
 */
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user: IUser | null = await User.findOne({ email });

    if (!user) {
      // For security, always send a success-like message to prevent email enumeration.
      res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please click on the following link to complete the process:</p>
      <a href="${resetURL}" clicktracking="off">${resetURL}</a>
      <p>This link will expire in 10 minutes.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      html: message,
    });

    res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });

  } catch (error: any) {
    console.error('FORGOT PASSWORD ERROR:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};


/**
 * @desc    Handle the final password reset after the user clicks the email link.
 * @route   PUT /api/auth/reset-password/:token
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user: IUser | null = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({ message: 'Invalid or expired password reset token.' });
      return;
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully.' });

  } catch (error: any) {
    console.error('RESET PASSWORD ERROR:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};