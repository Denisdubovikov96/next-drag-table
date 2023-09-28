import { Roboto } from 'next/font/google'

const inter = Roboto({weight:["400","500","700"], subsets: ['latin']})

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
     
    </main>
  )
}
