import type { Metadata } from "next";
import { CartProvider } from '@/context/CartContext'
import { Roboto_Slab, Roboto, Roboto_Flex } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import "./globals.css";

const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  variable: '--font-heading',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
})

const robotoFlex = Roboto_Flex({
  subsets: ['latin'],
  variable: '--font-link',
})

export const metadata: Metadata = {
  title: "Wispm Resort",
  description: "WISPM Accomodation Application",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${robotoSlab.variable} ${roboto.variable} ${robotoFlex.variable}`}>
      <body>
        <CartProvider>{children}</CartProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
