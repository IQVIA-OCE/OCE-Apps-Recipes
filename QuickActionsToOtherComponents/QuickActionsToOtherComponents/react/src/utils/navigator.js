import { environment, navigator } from 'oce-apps-bridges';

export const openNativeViewScreen = async (entity, id) => {
  try {
    await navigator.navigate({}, entity, id, 'present', 'view');
  } catch (error) {
    throw error;
  }
};

export const openNativeCreateScreen = async (params, entity) => {
  try {
    await navigator.navigate(params, entity, null, 'present', 'new');
  } catch (error) {
    throw error;
  }
};

// ToDo: Added a workaround until the open() method of the externalNavigator bridge is fixed.
export const openWEBCreateScreen = (params, entity) => {
  try {
    const sfInstanceURL = environment.sfInstanceURL();
    const url = Object.keys(params).reduce((url, key, index, array) => {
      return (
        url + key + '=' + params[key] + (index + 1 < array.length ? '&' : '')
      );
    }, `${sfInstanceURL}/lightning/o/${entity}/new?`);

    window.open(url, '_blank');
  } catch (error) {
    throw error;
  }
};
