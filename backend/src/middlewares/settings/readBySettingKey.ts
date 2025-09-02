import mongoose from 'mongoose';
const Model = mongoose.model('Setting');
type ReadBySettingKeyParams = { settingKey: string };
const readBySettingKey = async ({ settingKey }: ReadBySettingKeyParams) => {
  try {
    if (!settingKey) {
      return null;
    }
    const result = await Model.findOne({ settingKey });
    if (!result) {
      return null;
    } else {
      return result;
    }
  } catch {
    return null;
  }
};
export default readBySettingKey;
