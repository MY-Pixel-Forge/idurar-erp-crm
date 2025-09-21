import type { Request, Response } from 'express';

const listAll = async (Model: any, req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sort = (req as any).query.sort || 'desc';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enabled = (req as any).query.enabled || undefined;

  //  Query the database for a list of all results

  let result;
  if (enabled === undefined) {
    result = await Model.find({
      removed: false,
    })
      .sort({ created: sort })
      .populate()
      .exec();
  } else {
    result = await Model.find({
      removed: false,
      enabled: enabled,
    })
      .sort({ created: sort })
      .populate()
      .exec();
  }

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
