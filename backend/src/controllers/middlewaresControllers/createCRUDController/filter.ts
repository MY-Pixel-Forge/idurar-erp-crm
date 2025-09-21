import type { Request, Response } from 'express';

const filter = async (Model: any, req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((req as any).query.filter === undefined || (req as any).query.equal === undefined) {
    return res.status(403).json({
      success: false,
      result: null,
      message: 'filter not provided correctly',
    });
  }
  const result = await Model.find({
    removed: false,
  })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .where((req as any).query.filter)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .equals((req as any).query.equal)
    .exec();
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
      message: 'Successfully found all documents  ',
    });
  }
};

export default filter;
