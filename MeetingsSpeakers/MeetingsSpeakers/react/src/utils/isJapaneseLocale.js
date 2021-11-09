import { environment } from '../../bridge/EnvironmentData/EnvironmentData';

export const isJapaneseLocale = () => environment.locale() === 'ja_JP';
