import type { Request, Response } from 'express';

const paginatedList = async (Model: any, req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const page = (req as any).query.page || 1;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const limit = parseInt((req as any).query.items) || 10;
  const skip = page * limit - limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { sortBy = 'enabled', sortValue = -1, filter, equal } = (req as any).query as any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fieldsArray: any[] = (req as any).query.fields ? (req as any).query.fields.split(',') : [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fields: any;

  fields = fieldsArray.length === 0 ? {} : { $or: [] };

  for (const field of fieldsArray) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fields.$or.push({ [field]: { $regex: new RegExp((req as any).query.q, 'i') } });
  }

  //  Query the database for a list of all results
  const resultsPromise = Model.find({
    removed: false,

    [filter]: equal,
    ...fields,
  })
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortValue })
    .populate()
    .exec();

  // Counting the total documents
  const countPromise = Model.countDocuments({
    removed: false,

    [filter]: equal,
    ...fields,
  });
  // Resolving both promises
  const [result, count] = await Promise.all([resultsPromise, countPromise]);

  // Calculating total pages
  const pages = Math.ceil(count / limit);

  // Getting Pagination Object
  const pagination = { page, pages, count };
  if (count > 0) {
    return res.status(200).json({
      success: true,
      result,
      pagination,
      message: 'Successfully found all documents',
    });
  } else {
    return res.status(203).json({
      success: true,
      result: [],
      pagination,
      message: 'Collection is Empty',
    });
  }
};

export default paginatedList;
