
import mongoose from 'mongoose';
import type { Request, Response } from 'express';

const updateProfile = async (userModel: string, req: Request, res: Response) => {
  const User = mongoose.model<any>(userModel);

  const reqUserName = userModel.toLowerCase();
  // access user profile injected on the request (middleware)
  const userProfile = (req as any)[reqUserName] as any;

  if (userProfile.email === 'admin@admin.com') {
    return res.status(403).json({
      success: false,
      result: null,
      message: "you couldn't update demo informations",
    });
  }

  const body = (req as any).body || {};
  const updates = body.photo
    ? {
      email: body.email,
      name: body.name,
      surname: body.surname,
      photo: body.photo,
    }
    : {
      email: body.email,
      name: body.name,
      surname: body.surname,
    };
  // Find document by id and updates with the required fields
  const result = await User.findOneAndUpdate(
    { _id: userProfile._id, removed: false },
    { $set: updates },
    {
      new: true, // return the new result instead of the old one
    }
  ).exec();

  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No profile found by this id: ' + userProfile._id,
    });
  }
  return res.status(200).json({
    success: true,
    result: {
      _id: result?._id,
      enabled: result?.enabled,
      email: result?.email,
      name: result?.name,
      surname: result?.surname,
      photo: result?.photo,
      role: result?.role,
    },
    message: 'we update this profile by this id: ' + userProfile._id,
  });
};

export default updateProfile;
