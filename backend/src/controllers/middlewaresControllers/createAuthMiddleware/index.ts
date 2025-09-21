import type { Request, Response, NextFunction } from 'express';

import isValidAuthToken from './isValidAuthToken';
import login from './login';
import logout from './logout';
import forgetPassword from './forgetPassword';
import resetPassword from './resetPassword';

type AuthMethods = {
  isValidAuthToken: (req: Request, res: Response, next: NextFunction) => any;
  login: (req: Request, res: Response) => any;
  forgetPassword: (req: Request, res: Response) => any;
  resetPassword: (req: Request, res: Response) => any;
  logout: (req: Request, res: Response) => any;
};

const createAuthMiddleware = (userModel: string) => {
  const authMethods = {} as AuthMethods;

  authMethods.isValidAuthToken = (req: Request, res: Response, next: NextFunction) =>
    isValidAuthToken(req, res, next, {
      userModel,
    });

  authMethods.login = (req: Request, res: Response) =>
    login(req, res, {
      userModel,
    });

  authMethods.forgetPassword = (req: Request, res: Response) =>
    forgetPassword(req, res, {
      userModel,
    });

  authMethods.resetPassword = (req: Request, res: Response) =>
    resetPassword(req, res, {
      userModel,
    });

  authMethods.logout = (req: Request, res: Response) =>
    logout(req, res, {
      userModel,
    });
  return authMethods;
};

export default createAuthMiddleware;
