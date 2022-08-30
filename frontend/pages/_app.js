import Head from "next/head";
import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import Layout from '../components/layout'


function MyApp({ Component, pageProps }) {

  return (
    <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <Layout>
      <Component {...pageProps} />
    </Layout>
    </>
    );
}

export default MyApp
