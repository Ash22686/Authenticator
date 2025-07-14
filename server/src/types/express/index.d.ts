import { IUser } from '../../models/User';

declare global {
  namespace Express {
    // This merges with the existing Request interface and overrides the 'user' property
    interface Request {
      user?: IUser;
    }
  }
}