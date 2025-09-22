// ========== Types ==========
export type LangObject = Record<string, string>;
export type GetLabelFunction = (lang: LangObject, key: string) => string;
export type UseSelectorFunction = () => LangObject;
export type UseLanguageFunction = (params: { selectedLang: string }) => (value: string) => string;

// ========== Implementation ==========
import { readBySettingKey } from '../middlewares/settings';
import en_us from './translation/en_us';

export const getLabel: GetLabelFunction = (lang, key) => {
  try {
    const lowerCaseKey = key
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/ /g, '_');

    if (lang[lowerCaseKey]) return lang[lowerCaseKey];
    else {
      const remove_underscore_fromKey = lowerCaseKey.replace(/_/g, ' ').split(' ');
      const conversionOfAllFirstCharacterofEachWord = remove_underscore_fromKey.map(
        (word) => word[0].toUpperCase() + word.substring(1)
      );
      const label = conversionOfAllFirstCharacterofEachWord.join(' ');
      return label;
    }
  } catch (error) {
    return 'No translate Found';
  }
};

export const useSelector: UseSelectorFunction = () => {
  // default to bundled english translations
  return en_us;
};

export const useLanguage: UseLanguageFunction = ({ selectedLang }) => {
  const lang = useSelector();
  const translate = (value: string) => {
    const text = getLabel(lang, value);
    return text;
  };
  return translate;
};

export default useLanguage;
