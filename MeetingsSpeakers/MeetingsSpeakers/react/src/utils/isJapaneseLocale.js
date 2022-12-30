import { environment } from 'oce-apps-bridges';

export const isJapaneseLocale = () => environment.locale() === 'ja_JP';
