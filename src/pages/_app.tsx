import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { TrpcProvider } from "../utils/trpc-provider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TrpcProvider>
      <Component {...pageProps} />
    </TrpcProvider>
  )
}
