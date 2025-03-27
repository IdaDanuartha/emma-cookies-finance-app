import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Emma Cookies Finance App',
    short_name: 'Emma Cookies',
    description: 'Aplikasi manajemen keuangan emma cookies',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/apple-splash-750x1334.png',
        sizes: '750x1334',
        type: 'image/png',
      },
      {
        src: '/apple-splash-2868x1320.png',
        sizes: '2868x1320',
        type: 'image/png',
      },
    ],
  }
}