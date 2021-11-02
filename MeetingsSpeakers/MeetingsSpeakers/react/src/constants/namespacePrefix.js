import { environment } from '../../bridge/EnvironmentData/EnvironmentData';

export const NAMESPACE = environment.namespace() ?? '';

export const LOCALIZATION_NAMESPACE = NAMESPACE.toLowerCase();
