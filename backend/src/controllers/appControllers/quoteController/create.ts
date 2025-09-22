import mongoose from 'mongoose';
import type { Request, Response } from 'express';
const Model = mongoose.model('Quote') as mongoose.Model<any>;

import custom from '../../../controllers/pdfController';
import { increaseBySettingKey } from '../../../middlewares/settings';
import { calculate } from '../../../helpers';

const create = async (req: Request, res: Response) => {
  const { items = [], taxRate = 0, discount = 0 } = (req as any).body || {};

  // default
  let subTotal = 0;
  let taxTotal = 0;
  let total = 0;
  // let credit = 0;

  //Calculate the items array with subTotal, total, taxTotal
  items.map((item: any) => {
    let total = calculate.multiply(item['quantity'], item['price']);
    //sub total
    subTotal = calculate.add(subTotal, total);
    //item total
    item['total'] = total;
  });
  taxTotal = calculate.multiply(subTotal, taxRate / 100);
  total = calculate.add(subTotal, taxTotal);

  const body = (req as any).body || {};
  body['subTotal'] = subTotal;
  body['taxTotal'] = taxTotal;
  body['total'] = total;
  body['items'] = items;
  body['createdBy'] = (req as any).admin._id;

  // Creating a new document in the collection
  const result = await new Model(body).save();
  const fileId = 'quote-' + result._id + '.pdf';
  const updateResult = await Model.findOneAndUpdate(
    { _id: result._id },
    { pdf: fileId },
    {
      new: true,
    }
  ).exec();
  // Returning successfull response

  increaseBySettingKey({
    settingKey: 'last_quote_number',
  });

  // Returning successfull response
  return res.status(200).json({
    success: true,
    result: updateResult,
    message: 'Quote created successfully',
  });
};

export default create;
