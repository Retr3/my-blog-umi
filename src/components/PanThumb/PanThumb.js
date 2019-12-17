import React from 'react'
export default function PanThumb({imgUrl,width,height,zIndex,children}) {
    return (
        <div style={{zIndex,width,height}} className="pan-item">
            <div className="pan-info">
                <div className="pan-info-roles-container">
                    {children}
                </div>
            </div>
            <img src={imgUrl} alt="" className="pan-thumb"/>
        </div>
    )
}