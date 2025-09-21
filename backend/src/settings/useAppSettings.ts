type AppSettings = { [key: string]: any };

const useAppSettings = (): AppSettings => {
  const settings: AppSettings = {};
  settings['idurar_app_email'] = 'noreply@idurarapp.com';
  settings['idurar_base_url'] = 'https://cloud.idurarapp.com';
  return settings;
};

export default useAppSettings;
