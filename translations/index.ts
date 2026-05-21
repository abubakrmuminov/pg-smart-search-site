import { en } from './en';
import { ru } from './ru';

export const translations = {
  en,
  ru
};

export type Locale = keyof typeof translations;
export type TranslationDict = typeof en;
