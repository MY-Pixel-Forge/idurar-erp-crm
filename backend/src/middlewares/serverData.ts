import mongoose from 'mongoose';

export const getData = ({ model }: { model: string }) => {
  const Model = mongoose.model(model as any);
  const result = Model.find({ removed: false, enabled: true });
  return result;
};

export const getOne = ({ model, id }: { model: string; id: string }) => {
  const Model = mongoose.model(model as any);
  const result = Model.findOne({ _id: id, removed: false });
  return result;
};
