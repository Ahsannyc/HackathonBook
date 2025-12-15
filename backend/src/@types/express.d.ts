import { User, Session } from '../models/user';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      session?: Session;
    }
  }
}