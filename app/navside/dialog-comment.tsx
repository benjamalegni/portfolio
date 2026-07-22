"use client"

import { createTimeline, stagger, splitText } from 'animejs';
import { useEffect, useRef } from 'react';

export function DialogComment() {
  const pRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = pRef.current;
    if (!el) return;

    const { chars } = splitText(el, {
      chars: {
        wrap: 'clip',
        clone: 'bottom',
      },
    });

    const tl = createTimeline()
    .add(chars, {
      y: '-100%',
      loop: true,
      loopDelay: 350,
      duration: 750,
      ease: 'inOut(2)',
    }, stagger(150, { from: 'center' }));

    return () => { tl.cancel(); };
  }, []);

  return (
    <div className="group relative mb-2 flex justify-center">
      <div className="relative border border-2 border-orange-500 bg-neutral-900 px-8 py-4 text-sm text-neutral-300 shadow-lg transition-all duration-300 hover:border-orange-200 hover:text-orange-300 hover:shadow-orange-500">
        <div className="absolute left-1/2 top-full -translate-x-1/2 border-8 border-transparent border-t-neutral-900" />
        <div className="absolute left-1/2 top-full -translate-x-1/2 border-8 border-transparent border-t-orange-500 -translate-y-[-1px]" />
        <p ref={pRef} className="m-0 p-0">
          HOVER OVER ME!
        </p>
      </div>
    </div>
  )
}
