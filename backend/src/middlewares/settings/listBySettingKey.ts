import mongoose from 'mongoose';
const Model = mongoose.model('Setting');
type ListBySettingKeyParams = { settingKeyArray?: string[] };
const listBySettingKey = async ({ settingKeyArray = [] }: ListBySettingKeyParams) => {
  try {
    const settingsToShow: { $or: { settingKey: string }[] } = { $or: [] };
    if (settingKeyArray.length === 0) {
      return [];
    }
    for (const settingKey of settingKeyArray) {
      settingsToShow.$or.push({ settingKey });
    }
    let results = await Model.find({ ...settingsToShow }).where('removed', false);
    if (results.length >= 1) {
      return results;
    } else {
      return [];
    }
  } catch {
    return [];
  }
};
export default listBySettingKey;
