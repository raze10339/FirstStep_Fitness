import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';


dotenv.config();

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticate = async (req: AuthenticatedRequest, res: Response) => {
  const workout_token = req.cookies?.workout_token;

  if (workout_token) {
    try {

      if (!process.env.JWT_SECRET) {
        console.log('MUST ADD JWT_SECRET TO .env!');

        return {
          req: req,
          res: res
        }
      }

      const userData = verify(workout_token, process.env.JWT_SECRET);

      if (!userData || typeof userData === 'string') {
        return {
          req: req,
          res: res
        }
      }

      const user = await User.findById(userData.user_id);

      req.user = user;

    } catch (error) {
      console.log('JWT VERIFICATION ERROR', error);
    }
  }

  return {
    req: req,
    res: res
  };
}