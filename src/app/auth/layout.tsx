import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect'
import { WavyBackground } from '@/components/ui/wavy-background'
import React from 'react'

export default function layout({ children }: { children: React.ReactNode }) {
    return (

        <div className="relative min-h-screen w-full flex justify-center items-center overflow-hidden">
            <BackgroundRippleEffect rows={20}  />
            <div className='z-10 md:min-w-[600px]'>
                {children}
            </div>
        </div>
    )
}

<div className='relative min-h-screen flex flex-col overflow-hidden '>
    <BackgroundRippleEffect rows={20} />
    {/* <div className='absolute inset-0 h-full w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 opacity-80'/> */}
    <div className='z-10 flex flex-1 flex-col'>
    </div>
</div>