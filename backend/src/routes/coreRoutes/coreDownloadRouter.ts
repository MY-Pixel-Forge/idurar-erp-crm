import express, { Request, Response } from 'express';
import downloadPdf from '../../handlers/downloadHandler/downloadPdf';

const router = express.Router();

router.route('/:directory/:file').get(function (req: Request, res: Response) {
  try {
    const { directory, file } = req.params;
    const id = file.slice(directory.length + 1).slice(0, -4); // extract id from file name
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    downloadPdf(req as any, res as any, { directory, id });
  } catch (error) {
    return res.status(503).json({
      success: false,
      result: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: (error as any).message,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: error as any,
    });
  }
});

export default router;
