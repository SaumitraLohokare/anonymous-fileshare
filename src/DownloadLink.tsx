import React from 'react'

interface DownloadLinkProps {
    downloadLink: string
}

function DownloadLink(props: DownloadLinkProps) {
  return props.downloadLink === '' ? (
    <span className="title">Please <span className="link">upload</span> files to get the download link</span>
  ) : (
    <span className="title">Download the files at <span> </span>  
        <a className="link" href={props.downloadLink} target="_blank" rel="noreferrer">{props.downloadLink}</a>
    </span>
  )
}

export default DownloadLink