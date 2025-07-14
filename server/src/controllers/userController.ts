import { Request, Response } from 'express';
import User from '../models/User';

/**
 * @desc    Get the profile of the currently logged-in user
 * @route   GET /api/users/profile
 * @access  Private (requires token)
 */
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {

  const user = req.user;

 
  if (user) {
    
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    
    res.status(404).json({ message: 'User not found' });
  }
};