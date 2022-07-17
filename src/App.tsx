import React, { useState } from 'react';
import './App.css';
import ConnectionStatus from './ConnectionStatus';
import DownloadLink from './DownloadLink';
import gofile from './gofile-small.png';

function App() {

  let [server, setServer] = useState('');
  let [downloadLink, setDownloadLink] = useState('');
  let [fileList, setFileList] = useState<FileList>();
  let [folderId, setFolderId] = useState('');
  let [guestToken, setGuestToken] = useState('');

  /// GOFILE STUFF

  const getServer = async () => {
    await fetch('https://api.gofile.io/getServer')
    .then(resp => resp.json())
    .then(data => setServer(data.data.server));
  }

  const uploadFiles = async () => {
    if (!fileList) {
      console.log('Files not set!');
      return;
    }

    if (!server || server === '') {
      console.log('Server not set!');
      return;
    }

    let data = new FormData();
    data.append('file', fileList[0], fileList[0].name);
    if (folderId !== '') {
      data.append('folderId', folderId);
      data.append('token', guestToken);
    }

    await fetch(`https://${server}.gofile.io/uploadFile`, {
      method: 'POST',
      body: data
    })
    .then(response => response.json())
    .then(async response => {
      setDownloadLink(response.data.downloadPage);
      let _folderId = response.data.parentFolder;
      let _guestToken = response.data.guestToken;
      if (!folderId || folderId === '') setFolderId(response.data.parentFolder);
      if (!guestToken || guestToken === '') setGuestToken(response.data.guestToken);
      console.log(response);
      
      for (let i = 1; i < fileList!.length; i++) {
        data = new FormData();
        let file = fileList!.item(i);
        if (file && _folderId !== '') {
          data.append('file', file, file.name);
          data.append('token', _guestToken);
          data.append('folderId', _folderId);

          await fetch(`https://${server}.gofile.io/uploadFile`, {
              method: 'POST',
              body: data
          })
          .then(response => response.json())
          .then(response => {
              console.log(response);
          })
          .catch(error => console.error(error));
        }
      }
    })
    .catch(error => console.error(error));
  }

  /// ----

  if (!server || server === '') getServer();

  // TODO: Add drag and drop for files.
  const setFile = (target: HTMLInputElement) => {
    if (target.files) {
      setFileList(target.files);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <span className="logo"><span className="green-text">Ez</span>Share</span>        
        <ConnectionStatus isConnected={server !== ''} />
      </header>
        <main className="main-content">
          <DownloadLink downloadLink={downloadLink}/>
          <div className="drag-container">
            <div className="drag-container-inner">
              <span className="drag-text">Drag and Drop files to upload</span>
              <span className="browse-text">or 
                <input type="file" name="uploadFile" id="uploadFile" multiple={true} 
                  onChange={(e) => setFile((e.target as HTMLInputElement))} />
              </span>
              <button className="upload-button" onClick={uploadFiles}>Upload</button>
            </div>
          </div>
        </main>

        <footer>
          <span className="footer">Powered by GoFile</span>
          <img src={gofile} alt="gofile-logo" />
        </footer>
    </div>
  );
}

export default App;
