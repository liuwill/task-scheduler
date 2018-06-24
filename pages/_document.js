import Document, { Head, Main, NextScript } from 'next/document'

export default class extends Document {
  render () {
    return (
      <html>
        <Head>
          <meta charSet='utf-8' />
          <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1" />
          <link rel='stylesheet' href='/static/assets/antd.min.css' />
          {/* <link rel='stylesheet' href='/static/styles/common.css' /> */}
          <link rel='stylesheet' href='/_next/static/style.css'/>
        </Head>
        <body style={{margin: 0}}>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
