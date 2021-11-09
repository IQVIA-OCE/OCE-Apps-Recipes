// @flow

import { NativeModules } from 'react-native';

const fileViewer = NativeModules.FileViewerBridge;

class FileViewerBridge {
  viewAttachment(attachmentId: string): Promise<Object> {
    try {
      return fileViewer.viewAttachment(attachmentId);
    } catch (error) {
      return new Promise((resolve, reject) => {
        reject(error);
      });

    }
  }
}

export const fileViewerBridge: FileViewerBridge = new FileViewerBridge();
