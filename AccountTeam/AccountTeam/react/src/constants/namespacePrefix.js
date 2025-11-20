import { environment, locationManager } from '@oce-apps/oce-apps-bridges';

export const NAMESPACE = environment.namespace() ?? '';

export const LOCALIZATION_NAMESPACE = NAMESPACE.toLowerCase();
