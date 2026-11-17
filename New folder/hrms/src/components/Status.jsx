import React from "react";

export default function Status({value}){
    const text = String(value||'unknown');
    return(
        <span className={`status ${text.toLowerCase()}`}>
            {text}

        </span>
    )
}