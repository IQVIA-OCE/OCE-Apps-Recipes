import { environment, locationManager } from 'oce-apps-bridges';

export const NAMESPACE = environment.namespace() ?? '';

export const LOCALIZATION_NAMESPACE = NAMESPACE.toLowerCase();
