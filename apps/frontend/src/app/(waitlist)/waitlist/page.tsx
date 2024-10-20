import React from 'react'
import Image from 'next/image'
import waitlist from '../../../../public/icons/waitlist.svg'

type Props = {}

const Waitlist = (props: Props) => {
  return (
    <div className='flex flex-col justify-center items-center h-screen bg-background'>
      <Image 
      src={waitlist}
        alt="Waitlist" 
        width={60}
        height={60}
        className="absolute inset-0 object-cover w-full h-full opacity-30" 
      />
      <div className='relative z-10 p-6 bg-white rounded-lg shadow-lg max-w-md text-center'>
        <h3 className='text-2xl font-semibold text-secondary-foreground mb-4'>
          Thank You for Registering with March!
        </h3>
        <p className='text-lg text-gray-700'>
          Sit back and keep an eye on your email. You will receive your confirmation after we review your profile.
        </p>
      </div>
    </div>

    
  )
}

export default Waitlist
