import mongoose from 'mongoose';
import { Request, Response } from 'express';

const Model = mongoose.model('Payment') as any;

const sendMail = async (req: Request, res: Response) => {
  const payment = await Model.findOne({ _id: req.params.id, removed: false });

  if (!payment) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No payment found',
    });
  }

  return res.status(200).json({
    success: true,
    result: payment,
    message: 'Successfully send the payment invoice',
  });
};

export default sendMail;
