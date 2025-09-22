import type { Request, Response } from 'express';
import type mongoose from 'mongoose';

const update = async (Model: mongoose.Model<any>, req: Request, res: Response) => {
  const body = ((req as any).body || {}) as Record<string, any>;
  body.removed = false;
  const id = (req.params as any).id as string;
  const result = await Model.findOneAndUpdate(
    { _id: id, removed: false },
    body,
    { new: true, runValidators: true }
  ).exec();

  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found ',
    });
  }

  return res.status(200).json({
    success: true,
    result,
    message: 'we update this document ',
  });
};

export default update;
