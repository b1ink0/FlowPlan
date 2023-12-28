import React from 'react'
import { useStateContext } from '../../context/StateContext'

function Background() {
    const {currentGlobalBackground} = useStateContext()
  return (
    <div
        className="absolute top-0 left-0 w-full h-full -z-10 "
        style={{
            backgroundImage: currentGlobalBackground.backgroundImage,
            backgroundRepeat: currentGlobalBackground.backgroundRepeat,
            backgroundSize:  currentGlobalBackground.backgroundSize,
            backgroundPosition: currentGlobalBackground.backgroundPosition,
            opacity: currentGlobalBackground.opacity,
        }}
    ></div>
  )
}

export default Background