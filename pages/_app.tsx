import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { Header } from '@/components/header'

function MyApp({ Component, pageProps }: AppProps) {

  const theme = extendTheme({
    components: {
      Button: {
        baseStyle: {
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
        light: '#3366FF',
        dark: '#1C4FE8'
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

  return (
    <ChakraProvider theme={theme}>
      <ReduxProvider store={store}>
        <Header />
        <Component {...pageProps} />
      </ReduxProvider>
    </ChakraProvider>
  )

}

export default MyApp
