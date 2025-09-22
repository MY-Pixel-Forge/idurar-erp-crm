import mongoose from 'mongoose';
import type { Request, Response } from 'express';
import createCRUDController from '../../middlewaresControllers/createCRUDController';
import summary from './summary';

function modelController() {
  const Model = mongoose.model('Client') as mongoose.Model<any>;
  const methods: Record<string, any> = createCRUDController('Client');

  methods.summary = (req: Request, res: Response) => summary(Model, req, res);
  return methods;
}

export default modelController();
