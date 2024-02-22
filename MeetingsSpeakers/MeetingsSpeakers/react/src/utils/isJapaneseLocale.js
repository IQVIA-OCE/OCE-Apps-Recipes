import { environment } from '@oce-apps/oce-apps-bridges';

export const isJapaneseLocale = () => environment.locale() === 'ja_JP';
