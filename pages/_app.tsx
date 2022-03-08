import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { Header } from '@/components/header'
import Head from 'next/head';
import { useEffect, useState } from 'react';

declare global {
  interface Window { ic: any; }
}

function MyApp({ Component, pageProps }: AppProps) {

  const theme = extendTheme({
    components: {
      Button: {
        baseStyle: {
          width: '100px',
          height: '36px',
          borderRadius: '20px' ,
          _focus: {
            boxShadow: 'none'
          }
        }
      }
    },
    fonts: {
      header: 'Montserrat',
      body: 'Montserrat'
    },
    colors: {
      regular: {
        500: '#3366FF', // solid
        600: '#1C4FE8', // outline 
      },
      grey: {
        b4: '#E6E6E6',
        b3: '#C4C4C4',
        b2: '#666666',
        b1: '#000000'
      },
      sky: {
        light: '#ECF1FF'
      }
    },
  })

  const [dark, setDark] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)')?.matches) {
      // dark mode
      setDark(true)
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      setDark(event.matches ? true : false)
    });
  }, [])

  return (
    <ChakraProvider theme={theme}>
      <ReduxProvider store={store}>
        <Head>
          <title>ICNS</title>
          <meta name="description" content="Internet Computer Name Service" />
          <link rel="icon" href={
            dark ? "/favicon-light.svg" : "/favicon.svg"
          } />
        </Head>

        <Header />
        <Component {...pageProps} />
      </ReduxProvider>
    </ChakraProvider>
  )
}

export default MyApp
