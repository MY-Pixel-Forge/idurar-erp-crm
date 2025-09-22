import mongoose from 'mongoose';
import { Request, Response } from 'express';

const Model = mongoose.model('Taxes') as mongoose.Model<any>;
import createCRUDController from '../../middlewaresControllers/createCRUDController';
const methods: Record<string, any> = createCRUDController('Taxes');

delete methods['delete'];

methods.create = async (req: Request, res: Response) => {
  const { isDefault } = (req as any).body || {};

  if (isDefault) {
    await Model.updateMany({}, { isDefault: false });
  }

  const countDefault = await Model.countDocuments({
    isDefault: true,
  });

  const body = (req as any).body || {};
  const result = await new Model({ ...body, isDefault: countDefault < 1 ? true : false }).save();

  return res.status(200).json({
    success: true,
    result: result,
    message: 'Tax created successfully',
  });
};

methods.delete = async (req: Request, res: Response) => {
  return res.status(403).json({
    success: false,
    result: null,
    message: "you can't delete tax after it has been created",
  });
};

methods.update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tax = await Model.findOne({ _id: req.params.id, removed: false }).exec();
  const { isDefault = (tax as any)?.isDefault, enabled = (tax as any)?.enabled } = (req as any).body || {};

  // if isDefault:false , we update first - isDefault:true
  // if enabled:false and isDefault:true , we update first - isDefault:true
  if (!isDefault || (!enabled && isDefault)) {
    await Model.findOneAndUpdate({ _id: { $ne: id }, enabled: true }, { isDefault: true });
  }

  // if isDefault:true and enabled:true, we update other taxes and make is isDefault:false
  if (isDefault && enabled) {
    await Model.updateMany({ _id: { $ne: id } }, { isDefault: false });
  }

  const taxesCount = await Model.countDocuments({});

  // if enabled:false and it's only one exist, we can't disable
  if ((!enabled || !isDefault) && taxesCount <= 1) {
    return res.status(422).json({
      success: false,
      result: null,
      message: 'You cannot disable the tax because it is the only existing one',
    });
  }

  const result = await Model.findOneAndUpdate({ _id: id }, (req as any).body || {}, {
    new: true,
  });

  return res.status(200).json({
    success: true,
    message: 'Tax updated successfully',
    result,
  });
};

export default methods;
