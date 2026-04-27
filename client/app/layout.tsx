import type { Metadata } from "next";

import { Inter, Manrope, Space_Grotesk } from "next/font/google";



import { AppProviders } from "@/providers/app-providers";

import { NavigationBar } from "@/components/navigation/navigation-bar";



import "./globals.css";



const inter = Inter({

  variable: "--font-inter",

  subsets: ["latin"],

  display: "swap",

});



const manrope = Manrope({

  variable: "--font-manrope",

  subsets: ["latin"],

});



const spaceGrotesk = Space_Grotesk({

  variable: "--font-space-grotesk",

  subsets: ["latin"],

});



export const metadata: Metadata = {

  title: "University of Gondar House Allocation Portal",

  description: "Secure role-based access and housing account workflow for the University of Gondar.",

  icons: {

    icon: '/ashenafi.svg',

    shortcut: '/ashenafi.svg',

    apple: '/ashenafi.svg',

  },

};



export default function RootLayout({

  children,

}: Readonly<{

  children: React.ReactNode;

}>) {

  return (

    <html

      lang="en"

      data-scroll-behavior="smooth"

      className={`${manrope.variable} ${spaceGrotesk.variable} h-full antialiased`}

    >

      <head>

        {/* Performance optimizations */}

        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

        <meta name="theme-color" content="#000000" />

        {/* Favicon */}

        <link rel="icon" href="/ashenafi.svg" type="image/svg+xml" />

        <link rel="shortcut icon" href="/ashenafi.svg" />

        {/* Preconnect to external domains for faster loading */}

        <link rel="preconnect" href="https://fonts.googleapis.com" />

        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

      </head>

      <body className="min-h-full">

        <AppProviders>

          <NavigationBar />

          {children}

        </AppProviders>

      </body>

    </html>

  );

}

