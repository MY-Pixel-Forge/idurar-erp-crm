import mongoose from 'mongoose';
import type { Request, Response } from 'express';

const Model = mongoose.model('Setting') as any;

const listBySettingKey = async (req: Request, res: Response) => {
  // Find document by id
  const settingKeyArray = (req.query.settingKeyArray as any) ? (req.query.settingKeyArray as string).split(',') : [];

  const settingsToShow: any = { $or: [] };

  if (settingKeyArray.length === 0) {
    return res
      .status(202)
      .json({
        success: false,
        result: [],
        message: 'Please provide settings you need',
      })
      .end();
  }

  for (const settingKey of settingKeyArray) {
    settingsToShow.$or.push({ settingKey });
  }

  let results = await Model.find({
    ...settingsToShow,
  }).where('removed', false);

  // If no results found, return document not found
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

export default listBySettingKey;
