import type { Request, Response } from 'express';
import type mongoose from 'mongoose';

const read = async (Model: mongoose.Model<any>, req: Request, res: Response) => {
  // Find document by id
  const id = (req.params as any).id;
  const result = await Model.findOne({ _id: id, removed: false }).exec();
  // If no results found, return document not found
  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found ',
    });
  } else {
    // Return success resposne
    return res.status(200).json({
      success: true,
      result,
      message: 'we found this document ',
    });
  }
};
export default read;
