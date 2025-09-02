import mongoose from 'mongoose';
const Model = mongoose.model('Setting');
type IncreaseBySettingKeyParams = { settingKey: string };
const increaseBySettingKey = async ({ settingKey }: IncreaseBySettingKeyParams) => {
  try {
    if (!settingKey) {
      return null;
    }
    const result = await Model.findOneAndUpdate(
      { settingKey },
      {
        $inc: { settingValue: 1 },
      },
      {
        new: true, // return the new result instead of the old one
        runValidators: true,
      }
    ).exec();
    if (!result) {
      return null;
    } else {
      return result;
    }
  } catch {
    return null;
  }
};
export default increaseBySettingKey;
