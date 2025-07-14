import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/User'; // IUser is also exported from here

// We are still keeping our central type definition in `src/types/express/index.d.ts`
// and have removed the `declare global` block from this file.

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      // --- THE FIX IS HERE ---

      // Step 1: Execute the database query. The result can be IUser or null.
      const foundUser = await User.findById(decoded.id).select('-password');

      // Step 2: Explicitly handle the 'null' case.
      // If no user is found with the ID from the token, the user is not authorized.
      if (!foundUser) {
        res.status(401).json({ message: 'Not authorized, user not found' });
        return; // End the function here.
      }

      // Step 3: If a user was found, assign it to req.user.
      // At this point, TypeScript knows `foundUser` is of type `IUser`, which
      // perfectly matches the expected type for `req.user` (`IUser | undefined`).
      req.user = foundUser;

      // The request is valid, proceed to the next handler.
      next();

    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
      return;
    }
  } else { // Added 'else' for clearer logic
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};