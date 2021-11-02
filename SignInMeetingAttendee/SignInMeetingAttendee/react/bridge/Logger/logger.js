// @flow

import { NativeModules } from 'react-native';
import { forceExec } from '../utils';
import { Logging } from './logging';

class Logger implements Logging {
  getStackTrace(): Array<string> {
    let stack = new Error().stack;

    const lines = stack.split('\n').map(function (line) {
      return line.trim();
    });

    lines.splice(stack[0] == 'Error' ? 2 : 1, 1, '');

    return lines;
  }

  debug(msg: string, file: string = '') {
    this.log('bridgeLogLevelDebug', msg, file);
  }

  error(msg: string, file: string = '') {
    this.log('bridgeLogLevelError', msg, file);
  }

  warning(msg: string, file: string = '') {
    this.log('bridgeLogLevelWarning', msg, file);
  }

  info(msg: string, file: string = '') {
    this.log('bridgeLogLevelInfo', msg, file);
  }

  log(type: string, msg: string, file: string) {
    const stack = this.getStackTrace();
    const funcName = stack[2];

    // eslint-disable-next-line no-console
    console.log(type + ': ' + msg + ' ' + file + ' ' + stack[2]);

    const args = [type, msg, file, funcName, stack];

    forceExec(NativeModules.LoggerBridge, null, 'log', args);
    //NativeModules.LoggerBridge.log(args);
  }
}

export const iosLogger: Logger = new Logger();
