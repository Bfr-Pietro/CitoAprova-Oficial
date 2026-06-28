'use client'

import Script from 'next/script'

export function VLibrasWidget() {
  return (
    <>
      <div vw className="enabled">
        <div vw-access-button className="active"></div>
        <div vw-plugin-wrapper>
          <div className="vw-plugin-top-wrapper"></div>
        </div>
      </div>
      <Script
        src="https://vlibras.gov.br/app/vlibras-plugin.js"
        strategy="afterInteractive"
        onLoad={() => {
          new (window as any).VLibras.Widget('https://vlibras.gov.br/app')
        }}
      />
    </>
  )
}
