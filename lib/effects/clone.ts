import { createTimeline, stagger, splitText } from 'animejs';

const { chars } = splitText('p', {
  chars: {
    wrap: 'clip',
    clone: 'bottom'
  },
});

createTimeline()
.add(chars, {
  y: '-100%',
  loop: true,
  loopDelay: 350,
  duration: 750,
  ease: 'inOut(2)',
}, stagger(150, { from: 'center' }));
