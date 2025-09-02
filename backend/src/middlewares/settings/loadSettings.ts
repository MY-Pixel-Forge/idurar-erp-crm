import listAllSettings from './listAllSettings';
const loadSettings = async () => {
  const allSettings: Record<string, any> = {};
  const datas = await listAllSettings();
  datas.forEach(({ settingKey, settingValue }) => {
    allSettings[settingKey] = settingValue;
  });
  return allSettings;
};
export default loadSettings;
