import { environment } from '@oce-apps/oce-apps-bridges';

export const NAMESPACE = environment.namespace() ?? '';

export const TERRITORY = environment.territory();

export const USER_ID = environment.userId();
