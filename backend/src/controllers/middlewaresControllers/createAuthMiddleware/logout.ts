import mongoose from 'mongoose';
import type { Request, Response } from 'express';

const logout = async (req: Request, res: Response, { userModel }: { userModel: string }) => {
  const UserPassword = mongoose.model((userModel + 'Password') as any);

  // const token = req.cookies[`token_${cloud._id}`];

  const authHeader = req.headers['authorization'];
  const token = authHeader && (authHeader as string).split(' ')[1]; // Extract the token

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (token)
    await UserPassword.findOneAndUpdate({ user: (req as any).admin._id }, { $pull: { loggedSessions: token } }, { new: true }).exec();
  else
    await UserPassword.findOneAndUpdate({ user: (req as any).admin._id }, { loggedSessions: [] }, { new: true }).exec();

  return res.json({
    success: true,
    result: {},
    message: 'Successfully logout',
  });
};

export default logout;
