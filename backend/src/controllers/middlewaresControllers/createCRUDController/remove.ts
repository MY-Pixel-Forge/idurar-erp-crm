import type { Request, Response } from 'express';
import type mongoose from 'mongoose';

const remove = async (Model: mongoose.Model<any>, req: Request, res: Response) => {
  // Find the document by id and delete it
  let updates = {
    removed: true,
  };
  // Find the document by id and delete it
  const id = (req.params as any).id;
  const result = await Model.findOneAndUpdate({ _id: id }, { $set: updates }, { new: true }).exec();
  // If no results found, return document not found
  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found ',
    });
  } else {
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully Deleted the document ',
    });
  }
};

export default remove;
