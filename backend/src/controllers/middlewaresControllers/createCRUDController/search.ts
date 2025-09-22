import type { Request, Response } from 'express';
import type mongoose from 'mongoose';

const search = async (Model: mongoose.Model<any>, req: Request, res: Response) => {
  // console.log(req.query.fields)
  // if (req.query.q === undefined || req.query.q.trim() === '') {
  //   return res
  //     .status(202)
  //     .json({
  //       success: false,
  //       result: [],
  //       message: 'No document found by this request',
  //     })
  //     .end();
  // }
  const query = (req as any).query || {};
  const fieldsArray: string[] = query.fields ? String(query.fields).split(',') : ['name'];

  const fields: Record<string, any> = { $or: [] };

  for (const field of fieldsArray) {
    fields.$or.push({ [field]: { $regex: new RegExp(String(query.q || ''), 'i') } });
  }
  // console.log(fields)

  const results = await Model.find({ ...fields })
    .where('removed', false)
    .limit(20)
    .exec();

  if (results.length >= 1) {
    return res.status(200).json({
      success: true,
      result: results,
      message: 'Successfully found all documents',
    });
  } else {
    return res
      .status(202)
      .json({
        success: false,
        result: [],
        message: 'No document found by this request',
      })
      .end();
  }
};

export default search;
