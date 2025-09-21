import type { Request, Response } from 'express';

import read from './read';
import updateProfile from './updateProfile';
import updatePassword from './updatePassword';
import updateProfilePassword from './updateProfilePassword';

type UserController = {
  updateProfile: (req: Request, res: Response) => Promise<any> | any;
  updatePassword: (req: Request, res: Response) => Promise<any> | any;
  updateProfilePassword: (req: Request, res: Response) => Promise<any> | any;
  read: (req: Request, res: Response) => Promise<any> | any;
};

const createUserController = (userModel: string) => {
  const userController = {} as UserController;

  userController.updateProfile = (req: Request, res: Response) => updateProfile(userModel, req, res);
  userController.updatePassword = (req: Request, res: Response) => updatePassword(userModel, req, res);
  userController.updateProfilePassword = (req: Request, res: Response) => updateProfilePassword(userModel, req, res);

  userController.read = (req: Request, res: Response) => read(userModel, req, res);

  return userController;
};

export default createUserController;
