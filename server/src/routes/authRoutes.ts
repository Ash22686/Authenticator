import { Router, Request, Response } from 'express';
import { registerUser, verifyOtp, loginUser, forgotPassword, resetPassword } from '../controllers/authController';
import passport from 'passport';
import jwt from 'jsonwebtoken'; 

const router = Router();

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: '30d' });
};

// Route to handle user registration and send an OTP
router.post('/register', registerUser);

// Route to handle the OTP verification
router.post('/verify-otp', verifyOtp);

// Route to handle login for verified users
router.post('/login', loginUser);

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req: Request, res: Response) => {
      const user: any = req.user;
    const token = generateToken(user.id);
     res.redirect(`http://localhost:5173/?token=${token}`);
  }
);

router.post('/forgot-password', forgotPassword);

router.put('/reset-password/:token', resetPassword);

export default router;