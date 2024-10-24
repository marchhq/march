import React from 'react'
import Image from 'next/image'
import waitlist from '../../../../public/icons/logo.svg'
import { LogoDark } from '@/src/lib/icons/Logo'

type Props = {}

const Waitlist = (props: Props) => {
  return (
    <div className='flex flex-col justify-center items-center gap-4 h-screen bg-background text-primary-foreground'>
    {/* <Image
    src={waitlist}
    width={70}
    height={70}
    alt='March Logo'
    /> */}
    <LogoDark/>
    <h3 className='text-base'>your flight to mars is confirmed.</h3>
    <p className='ml-20 text-base text-secondary-foreground'> — we’ll get back to you soon;</p>
    </div>

    
  )
}

export default Waitlist
