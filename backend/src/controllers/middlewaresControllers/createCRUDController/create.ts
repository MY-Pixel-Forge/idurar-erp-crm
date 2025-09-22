import type { Request, Response } from 'express';
import type mongoose from 'mongoose';

const create = async (Model: mongoose.Model<any>, req: Request, res: Response) => {
  // Creating a new document in the collection
  const body = ((req as any).body || {}) as Record<string, any>;
  body.removed = false;
  const result = await new Model({ ...body }).save();

  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully Created the document in Model ',
  });
};

export default create;
