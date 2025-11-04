import { Html, Head, Main, NextScript } from 'next/document';
import { DocumentProps } from 'next/document';

export default function Document(props: DocumentProps) {
  return (
    <Html lang="en">
      <Head>
        <meta name="emotion-insertion-point" content="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800;900&family=Roboto:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800;900&family=Montserrat:wght@300;400;500;600;700;800;900&family=Lato:wght@300;400;700;900&family=Open+Sans:wght@300;400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
