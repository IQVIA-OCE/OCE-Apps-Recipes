// @flow

/*
 * @Author: Avenga
 * @Date:   2021-07-16
 *
 * @VisionService
 */

'use strict';

import { NativeModules } from 'react-native';

const visionService = NativeModules.VisionServiceBridge;

class VisionServiceBridge {
  scanBarcode(): Promise<Object> {
    try {
      return visionService.scanBarcode();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  scanDocument(): Promise<Object> {
    try {
      return visionService.scanDocument();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  detectObjects(modelName: String): Promise<Object> {
    try {
      return visionService.detectObjects(modelName);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export const visionServiceBridge: VisionServiceBridge = new VisionServiceBridge();
