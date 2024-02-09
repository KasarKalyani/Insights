import Link from 'next/link'
import { auth } from '@clerk/nextjs'

export default async function Home() {
  const { userId } = await auth()
  let href = userId ? '/journal' : 'new-user'
  return (
    <div className="w-screen h-screen bg-black flex justify-content items-center text-white">
      <div className="w-full max-w-[600px] mx-auto">
        <h1 className="text-6xl mb-4"> best journal ever</h1>
        <p className="text-2xl text-white/60">
          This is a best app for tracking your mood through out your life. All
          you have to do is be honest.
        </p>
        <div>
          <Link href={href}>
            <button className="bg-blue-600 px-4 py-2 rounded-lg text-xl">
              {' '}
              Lets Go
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
