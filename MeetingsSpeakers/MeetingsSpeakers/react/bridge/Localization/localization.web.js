// @flow

function allLocalizationKeys(): Array<string> {
  return ['sample', 'sample_0', 'sample_1', 'sample_2', 'sample_3'];
}

function localized(key: string, defaultValue: string): string {
  return defaultValue;
}

export { allLocalizationKeys, localized };
