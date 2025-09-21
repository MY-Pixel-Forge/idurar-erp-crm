import type { Request, Response } from 'express';

const update = async (Model: any, req: Request, res: Response) => {
  // Find document by id and updates with the required fields
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req as any).body.removed = false;
  const result = await Model.findOneAndUpdate(
    {
      _id: (req as any).params.id,
      removed: false,
    },
    (req as any).body,
    {
      new: true, // return the new result instead of the old one
      runValidators: true,
    }
  ).exec();
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
      message: 'we update this document ',
    });
  }
};

export default update;
