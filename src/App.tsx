import React, { useState } from 'react';
import './App.css';

function App() {

  let [server, setServer] = useState('');
  let [downloadLink, setDownloadLink] = useState('');
  let [fileList, setFileList] = useState<FileList>();

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

    await fetch(`https://${server}.gofile.io/uploadFile`, {
      method: 'POST',
      body: data
    })
    .then(response => response.json())
    .then(async response => {
      setDownloadLink(response.data.downloadPage);

      let folderId = response.data.parentFolder;
      let guestToken = response.data.guestToken;
      console.log(response);
      
      for (let i = 1; i < fileList!.length; i++) {
        data = new FormData();
        let file = fileList!.item(i);
        if (file && folderId !== '') {
          data.append('file', file, file.name);
          data.append('token', guestToken);
          data.append('folderId', folderId);

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
    if (target.files) setFileList(target.files);
  }

  // TODO: Make good UI.
  return (
    <div className="App">
      <header className="App-header">
        <span>Server is {server}!</span>
        <br />
        <br />
        <input type="file" name="uploadFile" id="uploadFile" multiple={true} onChange={(e) => setFile((e.target as HTMLInputElement))}/>
        <button onClick={uploadFiles}>Upload File</button>
        <br />
        <br />
        <span>File uploaded can be downloaded at <a href={downloadLink} target="_blank" rel="noreferrer">{downloadLink}</a></span>
      </header>
    </div>
  );
}

export default App;
