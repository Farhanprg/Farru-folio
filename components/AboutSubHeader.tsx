import React from 'react'

const SERVICES = [
    {
        title: 'Websites and App Development',
        body: 'From idea to launch, full cycle development including frontend, backend, and deployment.',
    },
    {
        title: 'AI Automation Systems',
        body: 'Designing and integrating AI Automation to optimize workflows, reduce manual effort, and enhance system intelligence.',
    },
    {
        title: 'UI/UX Design',
        body: 'Minimal, clean, and user-focused interfaces aligned with modern standards.',
    },
    {
        title: 'Brand Identity',
        body: 'Creating complete visual identities that define and elevate digital products.',
    },
]

export default function AboutSubHeader() {
    return (
        <div className='relative md:absolute md:top-1/4 left-0 md:left-[10%] w-full z-10 flex flex-col md:items-start items-center px-6 md:px-0 mt-12 md:mt-0'>
            <div className='w-full md:w-[40%] text-base md:text-2xl flex flex-col gap-4 leading-relaxed md:leading-snug text-center md:text-left text-white/80 font-light'>
                <p>
                    A developer with a <span className="font-brier italic text-[#D1FF1C] tracking-normal px-1">creative mind</span>, obsessed with engineering unforgettable digital WOW moments.
                </p>
                <p>
                    I don't just write code; I craft experiences. From fluid micro-interactions to robust architectures, my goal is to build interfaces that force users to stop their scroll.
                </p>
            </div>

            <div className='w-full md:w-[45%] mt-12 md:mt-24 bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10 backdrop-blur-sm'>
                <div className='mb-6 pb-4 border-b border-white/10'>
                    <span className='text-white/40 tracking-[0.2em] font-medium text-xs md:text-sm uppercase'>SERVICES</span>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'>
                    {SERVICES.map((service) => (
                        <article key={service.title} className='flex flex-col gap-2'>
                            <h4 className="text-white text-sm md:text-base font-semibold tracking-wide">{service.title}</h4>
                            <p className="text-white/50 text-xs md:text-sm leading-relaxed">{service.body}</p>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    )
}
