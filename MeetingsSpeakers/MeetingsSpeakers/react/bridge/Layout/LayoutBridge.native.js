// @flow

import { NativeModules } from 'react-native';

class LayoutBridge {
  /*
   * Sets height of widget's container view.
   * Works only with widgets.
   * @param height: height in points
   */
  setHeight(height: Number): Promise<Object> {
    try {
      return NativeModules.LayoutBridge.setNewHeight(height);
    } catch (error) {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
  }

  /*
   * Set supported orientations for application.
   * Works only with iPhone/iPod Touch
   * Works only with fullscreen apps
   * @param orientations: string with one of the values: "portrait", "landscape", "allButUpsideDown"
   * @param [error=null] function called in case of error
   */
  setSupportedOrientationsForIPhone(orientations: string): Promise<Object> {
    try {
      return NativeModules.LayoutBridge.setSupportedOrientationsForIPhone(
        orientations
      );
    } catch (error) {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
  }

  /*
   * Close application programatically
   */
  closeApp(): Promise<Object>  {
      try {
          return NativeModules.LayoutBridge.closeApp();
      } catch (error) {
          return Promise.reject(error);
      }
    }
  }

export const layoutBridge: LayoutBridge = new LayoutBridge();
