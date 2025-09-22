import mongoose from 'mongoose';
import type { Request, Response } from 'express';

const Model = mongoose.model('Setting') as any;

const listAll = async (req: Request, res: Response) => {
  const sort = parseInt(req.query.sort as any) || 'desc';

  //  Query the database for a list of all results
  const result = await Model.find({
    removed: false,
    isPrivate: false,
  }).sort({ created: sort });

  if (result.length > 0) {
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully found all documents',
    });
  } else {
    return res.status(203).json({
      success: false,
      result: [],
      message: 'Collection is Empty',
    });
  }
};

export default listAll;
