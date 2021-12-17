// @flow

export interface Logging {
  debug(msg: string): void;
  error(msg: string): void;
  warning(msg: string): void;
  info(msg: string): void;

  debug(msg: string, file: string): void;
  error(msg: string, file: string): void;
  warning(msg: string, file: string): void;
  info(msg: string, file: string): void;
}
