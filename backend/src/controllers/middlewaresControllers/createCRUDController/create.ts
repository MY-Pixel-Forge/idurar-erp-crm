import type { Request, Response } from 'express';

const create = async (Model: any, req: Request, res: Response) => {
  // Creating a new document in the collection
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req as any).body.removed = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await new Model({
    ...(req as any).body,
  }).save();

  // Returning successful response
  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully Created the document in Model ',
  });
};

export default create;
