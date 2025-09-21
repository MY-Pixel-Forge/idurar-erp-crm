import type { Request, Response } from 'express';

const search = async (Model: any, req: Request, res: Response) => {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fieldsArray = (req as any).query.fields ? (req as any).query.fields.split(',') : ['name'];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fields: any = { $or: [] };

  for (const field of fieldsArray) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fields.$or.push({ [field]: { $regex: new RegExp((req as any).query.q, 'i') } });
  }
  // console.log(fields)

  let results = await Model.find({
    ...fields,
  })

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
