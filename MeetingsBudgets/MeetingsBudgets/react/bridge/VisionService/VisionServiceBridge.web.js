// @flow

/*
 * @Author: Avenga
 * @Date:   2021-07-16
 *
 * @VisionService
 */

'use strict';

import { NativeModules } from 'react-native';

// const visionService = NativeModules.VisionServiceBridge;

class VisionServiceBridge {
  scanBarcode(): Promise<Object> {
    return Promise.reject('scanBarcode method is not implemented')
  }

  scanDocument(): Promise<Object> {
    return Promise.reject('scanDocument method is not implemented')
  }

  detectObjects(modelName: String): Promise<Object> {
    return Promise.reject('detectObjects method is not implemented')
  }
}

export const visionServiceBridge: VisionServiceBridge = new VisionServiceBridge();
