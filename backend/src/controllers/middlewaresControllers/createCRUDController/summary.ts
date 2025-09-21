import type { Request, Response } from 'express';

const summary = async (Model: any, req: Request, res: Response) => {
  //  Query the database for a list of all results
  const countPromise = Model.countDocuments({
    removed: false,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resultsPromise = Model.countDocuments({
    removed: false,
  })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .where((req as any).query.filter)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .equals((req as any).query.equal)
    .exec();
  // Resolving both promises
  const [countFilter, countAllDocs] = await Promise.all([resultsPromise, countPromise]);

  if (countAllDocs > 0) {
    return res.status(200).json({
      success: true,
      result: { countFilter, countAllDocs },
      message: 'Successfully count all documents',
    });
  } else {
    return res.status(203).json({
      success: false,
      result: [],
      message: 'Collection is Empty',
    });
  }
};

export default summary;
