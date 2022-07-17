import React from 'react'
import './ConnectionStatus.css';

interface ConnectionStatusProps {
    isConnected: boolean
}

function ConnectionStatus(props: ConnectionStatusProps) {

    let classes = "circle " + (props.isConnected ? "connected" : "not-connected");
    return (
        <div className="connection-status">
            <span>{props.isConnected ? "Connected" : "Not Connected"}</span>
            <div className={classes}></div>
        </div>
    )
}

export default ConnectionStatus