import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { generate as uniqueId } from 'shortid';
import type { Request, Response } from 'express';

const updatePassword = async (userModel: string, req: Request, res: Response) => {
  const UserPassword = mongoose.model((userModel + 'Password') as any);

  const reqUserName = userModel.toLowerCase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userProfile: any = (req as any)[reqUserName];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let { password } = (req as any).body;

  if (password.length < 8)
    return res.status(400).json({
      msg: 'The password needs to be at least 8 characters long.',
    });

  // Find document by id and updates with the required fields

  if (userProfile.email === 'admin@admin.com') {
    return res.status(403).json({
      success: false,
      result: null,
      message: "you couldn't update demo password",
    });
  }

  const salt = uniqueId();

  const passwordHash = bcrypt.hashSync(salt + password);

  const UserPasswordData = {
    password: passwordHash,
    salt: salt,
  };

  const resultPassword = await UserPassword.findOneAndUpdate(
    { user: req.params.id, removed: false },
    { $set: UserPasswordData },
    {
      new: true, // return the new result instead of the old one
    }
  ).exec();

  // Code to handle the successful response

  if (!resultPassword) {
    return res.status(403).json({
      success: false,
      result: null,
      message: "User Password couldn't save correctly",
    });
  }

  return res.status(200).json({
    success: true,
    result: {},
    message: 'we update the password by this id: ' + userProfile._id,
  });
};

export default updatePassword;
