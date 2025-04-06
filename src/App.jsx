import { useState, useRef } from 'react'

import heads from './assets/heads.svg'
import tails from './assets/tails.svg'
import shadow from './assets/shadow.svg'

function App() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState('Heads')
  const timeRef = useRef(0);
  const coinRef = useRef();
  function handleFlip() {
    const timeElapsed = timeRef.current;
    timeRef.current = timeElapsed + 1;
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails'

    setResult(result)


    if (timeRef.current < 150) {
      requestAnimationFrame(handleFlip)
      return;
    }
    timeRef.current = 0;
    handleCoinStop(result);
    setIsSpinning(false);
  }
  function handleCoinStop(coinface) {
    const coinElem = coinRef.current;
  
    // Remove spinning class
    coinElem.classList.remove('floating-and-spin-animation');
  
    // Get current rotation — we'll animate manually
    let start = null;
    const duration = 600;
    let currentAngle = 0;
  
    // We'll rotate from wherever it is now (fake, since we can't get real angle)
    // to the final face
    const endAngle = coinface === 'Heads' ? 0 : 180;
    const totalRotation = 5 * 360 + endAngle; // 5 spins + target face
  
    function animateStop(timestamp) {
      coinElem.classList.remove('floating-animation');

      if (!start) start = timestamp;
      const elapsed = timestamp - start;
  
      // Ease out
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
  
      currentAngle = easeOut * totalRotation;
  
      coinElem.style.transform = `translateY(0) rotateY(${currentAngle}deg)`;
  
      if (progress < 1) {
        requestAnimationFrame(animateStop);
      }
    }
  
    coinElem.classList.add('floating-animation')
    requestAnimationFrame(animateStop);
  }
  
  function getRotateYFromMatrix3d(matrixString) {
    const values = matrixString.match(/matrix3d\(([^)]+)\)/);

    if (!values) return null;

    const matrix = values[1].split(',').map(parseFloat);

    // The rotationY can be derived from the matrix as:
    // angleY = Math.asin(-matrix[2]) (in radians)
    const angleInRadians = Math.asin(-matrix[2]);
    const angleInDegrees = angleInRadians * (180 / Math.PI);

    return angleInDegrees;
  }
  return (
    <>
      <main className='min-h-screen flex items-center justify-center'>
        <div className="container gap-16 py-6 px-4 flex items-center justify-center flex-col">
          <div className="app-info">
            <h1 className='app-heading text-shadow-100 tracking-tighter text-5xl sm:text-[4rem] mb-6'>Flip the coin</h1>
            <p className="instructions text-lg sm:text-2xl">Press the coin or the button to flip the coin</p>
          </div>

          <div className="coin-data flex flex-col items-center justify-center gap-10">
            <div ref={coinRef} className={"coin-image relative h-40 w-40 " + (isSpinning ? " floating-and-spin-animation " : " floating-animation")}>
              <img src={tails} alt="tails" className="tail w-full absolute backface-hidden rotate-x-180" />
              <img src={heads} alt="heads" className="head w-full absolute backface-hidden rotate-x-0" />
            </div>
            <div className="shadow">
              <img src={shadow} alt="shadow" className={"shadow-img " + (isSpinning ? " scale-and-spin-animation " : " shadow-animation")} />
            </div>
          </div>
          <div className="action">
            <h2 className="current-face text-lg sm:text-2xl mb-16">{result}</h2>
            <button className='random-btn text-md sm:text-xl box-shadow-100 w-40 px-2 py-2 rounded-lg cursor-pointer' onClick={() => { handleFlip(); setIsSpinning(true) }}>RANDOM</button>
          </div>
        </div>
      </main>
    </>
  )
}

export default App
