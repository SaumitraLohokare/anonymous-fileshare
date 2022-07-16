import React, { useState } from 'react';
import './App.css';

function App() {

  let [server, setServer] = useState('');
  let [fileData, setFileData] = useState<File>();
  let [downloadLink, setDownloadLink] = useState('');

  const getServer = async () => {
    await fetch('https://api.gofile.io/getServer')
    .then(resp => resp.json())
    .then(data => setServer(data.data.server));
  }

  const setFile = (target: HTMLInputElement) => {
    let file = target.files?.item(0);
    if (file) {
      setFileData(file);
    }
  }

  const uploadFile = async () => {
    if (!fileData) {
      console.log('File not set!');
      return;
    }

    if (!server || server === '') {
      console.log('Server not set!');
      return;
    }

    let data = new FormData();
    data.append('file', fileData, fileData.name);

    await fetch(`https://${server}.gofile.io/uploadFile`,{
      method: 'POST',
      body: data
    })
    .then(response => response.json())
    .then(response => {
      setDownloadLink(`https://${server}.gofile.io/download/direct/${response.data.fileId}/${response.data.fileName}`);
      console.log(response);
      
    })
    .catch(error => console.error(error))
  }

  return (
    <div className="App">
      <header className="App-header">
        <span>Server is {server}!</span>
        <button onClick={getServer}>Get Server</button>
        <br />
        <br />
        <input type="file" name="uploadFile" id="uploadFile" onChange={(e) => setFile((e.target as HTMLInputElement))}/>
        <button onClick={uploadFile}>Upload File</button>
        <br />
        <br />
        <span>File uploaded can be downloaded at <a href={downloadLink}>{downloadLink}</a></span>
      </header>
    </div>
  );
}

export default App;
