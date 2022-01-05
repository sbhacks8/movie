import React from 'react'

export default function Overlay({ ready, clicked, setClicked, videoPlayer }) {
  return (
    <>
      <div className={`fullscreen bg ${ready ? 'ready' : 'notready'} ${clicked && 'clicked'}`}>
        <div
          onClick={() => {
            ready && setClicked(true)
            videoPlayer.current.image.play()
          }}>
          {!ready ? 'loading' : 'click to continue'}
        </div>
      </div>
    </>
  )
}
