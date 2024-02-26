import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import {displayErrorMsg} from './common';
import {Platform} from 'react-native';
import {showMessage} from 'react-native-flash-message';

export const downloadFileFromUrl = (url, fileName, view = false) => {
  const downloadPath =
    Platform.OS == 'android'
      ? RNFS.DocumentDirectoryPath
      : RNFS.LibraryDirectoryPath;
  const filePath = downloadPath + '/' + fileName;
  console.log('downloadFile',filePath,url)
  RNFS.downloadFile({
    fromUrl: encodeURI(url),
    toFile: filePath,
    begin: response => {
      console.log(response);
    },
  })
    .promise.then(response => {
      if (view) {
        FileViewer.open(filePath)
          .then(() => {
            console.log('displayed file');
          })
          .catch(error => {
            displayErrorMsg(error);
            console.log(error);
          });
      } else {
        showMessage('File downloaded to ' + filePath);
      }
    })
    .catch(error => {
      console.log(error);
    });
};
