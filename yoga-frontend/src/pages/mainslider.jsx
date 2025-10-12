import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../pages/CSS/mainslider.css'; // Make sure this CSS file is present and correct

// Import your images
// Assuming these images are in a folder like `src/assets/images/`
// or directly in `public/` depending on your project structure.
// Adjust paths as necessary for your project.
import s1 from '../assets/s1.jpg'; // Adjust path if needed
import s2 from '../assets/s2.jpg'; // Adjust path if needed
import s3 from '../assets/s3.jpg'; // Adjust path if needed
import s4 from '../assets/s4.jpg'; // Adjust path if needed
import s5 from '../assets/s5.jpg'; // Adjust path if needed




// Helper function for smooth transitions (Linear Interpolation)
// More about this function: https://codepen.io/rachsmith/post/animation-tip-lerp
const lerp = ({ x, y }, { x: targetX, y: targetY }) => {
  const fraction = 0.1;
  x += (targetX - x) * fraction;
  y += (targetY - y) * fraction;
  return { x, y };
};

const Slider = () => {
  // UPDATED IMAGES ARRAY WITH YOUR PROVIDED IMAGE PATHS
  const images = [
    s1,
    s2,
    s3,
    s4,
    s5
  ];

  const text = {
    "Tree Pose": '“Rooted in balance, rising with grace.”',
    "Meditation": '“Chanting guides the mind into stillness and the soul into presence.”',
    "Surya Namaskar": '“Salute the sun, awaken your inner light.”',
    "Trikonasana": '“Expand with strength, align with clarity.”',
    "Utkatasana": '“Ignite your strength, embrace the challenge.”',
    "Group Energy": '“United in breath, aligned in purpose.”',
    "Sunset Bliss": '“Embrace the light, release the day.”'
  };

  const [activeSlideId, setActiveSlideId] = useState(1);
  const sliderRef = useRef(null);
  const contentRef = useRef(null);
  const activeImgRef = useRef(null); // Ref to currently active image element
  const activeTextRef = useRef(null); // Ref to currently active text element

  // Mouse animation state
  const lastMousePos = useRef({ x: 0, y: 0 });
  const targetMousePos = useRef({ x: 0, y: 0 });
  const animationRunning = useRef(false);
  const animationStopped = useRef(false);
  const inTransition = useRef(false);
  const isMobile = useRef(false);

  // Constants from CSS
  const IMG_CLASS = 'slider__images-item';
  const TEXT_CLASS = 'slider__text-item';
  const ACTIVE_IMG_CLASS = `${IMG_CLASS}--active`;
  const ACTIVE_TEXT_CLASS = `${TEXT_CLASS}--active`;
  const SUB_ACTIVE_CLASS = `${IMG_CLASS}--subactive`;
  const TRANSIT_CLASS = `${IMG_CLASS}--transit`;
  const BACKWARDS_TEXT_CLASS = `${TEXT_CLASS}--backwards`;

  const getMouseCoefficients = useCallback(({ pageX, pageY }) => {
    const halfWidth = window.innerWidth / 2;
    const halfHeight = window.innerHeight / 2;
    const xCoeff = ((pageX || targetMousePos.current.x) - halfWidth) / halfWidth;
    const yCoeff = (halfHeight - (pageY || targetMousePos.current.y)) / halfHeight;
    return { xCoeff, yCoeff };
  }, []);

  const positionImage = useCallback(({ xCoeff, yCoeff }) => {
    const maxImgOffset = 1;
    if (activeImgRef.current && activeImgRef.current.children[0]) {
      activeImgRef.current.children[0].style.setProperty('transform', `
        translateX(${maxImgOffset * -xCoeff}em)
        translateY(${maxImgOffset * yCoeff}em)
      `);
    }
  }, []);

  const runAnimation = useCallback(() => {
    if (animationStopped.current) {
      animationRunning.current = false;
      return;
    }

    const maxX = 10;
    const maxY = 10;

    const newPos = lerp(lastMousePos.current, targetMousePos.current);

    const { xCoeff, yCoeff } = getMouseCoefficients({
      pageX: newPos.x,
      pageY: newPos.y
    });

    lastMousePos.current = newPos;

    positionImage({ xCoeff, yCoeff });

    const htmlStyles = getComputedStyle(document.documentElement);
    const zDistance = htmlStyles.getPropertyValue('--z-distance');

    if (contentRef.current) {
      contentRef.current.style.setProperty('transform', `
        translateZ(${zDistance})
        rotateX(${maxY * yCoeff}deg)
        rotateY(${maxX * xCoeff}deg)
      `);
    }

    const reachedFinalPoint = (
      (~~lastMousePos.current.x === ~~targetMousePos.current.x ||
       ~~lastMousePos.current.x - 1 === ~~targetMousePos.current.x ||
       ~~lastMousePos.current.x + 1 === ~~targetMousePos.current.x) &&
      (~~lastMousePos.current.y === ~~targetMousePos.current.y ||
       ~~lastMousePos.current.y - 1 === ~~targetMousePos.current.y ||
       ~~lastMousePos.current.y + 1 === ~~targetMousePos.current.y)
    );

    if (reachedFinalPoint) {
      animationRunning.current = false;
    } else {
      requestAnimationFrame(runAnimation);
    }
  }, [getMouseCoefficients, positionImage]);

  const onMouseMove = useCallback((e) => {
    targetMousePos.current = { x: e.pageX, y: e.pageY };
    if (!animationRunning.current) {
      animationRunning.current = true;
      runAnimation();
    }
  }, [runAnimation]);

  const switchBackgroundImage = useCallback((nextId) => {
    const bgClass = 'slider--bg-next';
    const imageUrl = `url(${images[nextId - 1]})`;

    const onBackgroundTransitionEnd = (e) => {
      if (e.target === sliderRef.current) {
        sliderRef.current.style.setProperty('--img-prev', imageUrl);
        sliderRef.current.classList.remove(bgClass);
        sliderRef.current.removeEventListener('transitionend', onBackgroundTransitionEnd);
      }
    };

    if (sliderRef.current) {
      sliderRef.current.style.setProperty('--img-next', imageUrl);
      sliderRef.current.addEventListener('transitionend', onBackgroundTransitionEnd);
      sliderRef.current.classList.add(bgClass);
    }
  }, [images]);

  const transitionItem = useCallback((nextId) => {
    const currentImgEl = activeImgRef.current;
    if (!currentImgEl) return; // Should not happen if state is managed correctly

    const currentId = currentImgEl.dataset.id;
    const nextImgEl = sliderRef.current.querySelector(`.${IMG_CLASS}[data-id='${nextId}']`);
    const nextTextEl = sliderRef.current.querySelector(`.${TEXT_CLASS}[data-id='${nextId}']`);

    let outClass = '';
    let inClass = '';

    animationStopped.current = true;

    if (nextTextEl) {
      nextTextEl.classList.add(ACTIVE_TEXT_CLASS);
    }

    if (sliderRef.current) {
      sliderRef.current.style.setProperty('--from-left', nextId);
    }

    currentImgEl.classList.remove(ACTIVE_IMG_CLASS);
    currentImgEl.classList.add(SUB_ACTIVE_CLASS);

    if (parseInt(currentId) < parseInt(nextId)) {
      outClass = `${IMG_CLASS}--next`;
      inClass = `${IMG_CLASS}--prev`;
    } else {
      outClass = `${IMG_CLASS}--prev`;
      inClass = `${IMG_CLASS}--next`;
    }

    if (nextImgEl) {
      nextImgEl.classList.add(outClass);
    }

    requestAnimationFrame(() => {
      if (nextImgEl) {
        nextImgEl.classList.add(TRANSIT_CLASS, ACTIVE_IMG_CLASS);
        nextImgEl.classList.remove(outClass);
      }

      animationStopped.current = false;
      positionImage(getMouseCoefficients());

      const onImageTransitionEnd = (e) => {
        e.stopPropagation();
        if (nextImgEl) {
          nextImgEl.classList.remove(TRANSIT_CLASS);
        }
        inTransition.current = false;
        if (currentImgEl) {
          currentImgEl.className = IMG_CLASS; // Reset class for current (now previous) image
          currentImgEl.removeEventListener('transitionend', onImageTransitionEnd);
        }
      };

      if (currentImgEl) {
        currentImgEl.classList.add(TRANSIT_CLASS, inClass);
        currentImgEl.addEventListener('transitionend', onImageTransitionEnd);
      }
    });

    if (!isMobile.current) {
      switchBackgroundImage(nextId);
    }
  }, [ACTIVE_IMG_CLASS, SUB_ACTIVE_CLASS, TRANSIT_CLASS, IMG_CLASS, ACTIVE_TEXT_CLASS, getMouseCoefficients, positionImage, switchBackgroundImage]);

  const startTransition = useCallback((nextId) => {
    if (inTransition.current) return;

    const currentActiveTextEl = activeTextRef.current;

    inTransition.current = true;

    if (currentActiveTextEl) {
      currentActiveTextEl.classList.add(BACKWARDS_TEXT_CLASS);
      currentActiveTextEl.classList.remove(ACTIVE_TEXT_CLASS);

      const onTextTransitionEnd = (e) => {
        if (!e.pseudoElement) {
          e.stopPropagation();
          requestAnimationFrame(() => {
            transitionItem(nextId);
          });
          currentActiveTextEl.removeEventListener('transitionend', onTextTransitionEnd);
        }
      };
      currentActiveTextEl.addEventListener('transitionend', onTextTransitionEnd);
    } else {
        // Fallback if no active text found (e.g., initial load)
        transitionItem(nextId);
    }

    requestAnimationFrame(() => {
      if (currentActiveTextEl) {
        currentActiveTextEl.classList.remove(BACKWARDS_TEXT_CLASS);
      }
    });
  }, [transitionItem, ACTIVE_TEXT_CLASS, BACKWARDS_TEXT_CLASS]);

  const nextSlide = useCallback(() => {
    let nextId = activeSlideId + 1;
    if (nextId > images.length) {
      nextId = 1;
    }
    setActiveSlideId(nextId); // Update state to trigger re-render and ref updates
    startTransition(nextId);
  }, [activeSlideId, images.length, startTransition]);

  const prevSlide = useCallback(() => {
    let nextId = activeSlideId - 1;
    if (nextId < 1) {
      nextId = images.length;
    }
    setActiveSlideId(nextId); // Update state
    startTransition(nextId);
  }, [activeSlideId, images.length, startTransition]);

  const onDotClick = useCallback((e) => {
    const dot = e.target.closest('.slider__nav-dot');
    if (!dot) return;

    const nextId = parseInt(dot.dataset.id);
    if (activeSlideId === nextId) return;

    setActiveSlideId(nextId); // Update state
    startTransition(nextId);
  }, [activeSlideId, startTransition]);

  // Handle resize and mouse movement listeners
  useEffect(() => {
    const handleResize = () => {
      const htmlStyles = getComputedStyle(document.documentElement);
      const mobileBreakpoint = htmlStyles.getPropertyValue('--mobile-bkp');
      isMobile.current = matchMedia(`only screen and (max-width: ${mobileBreakpoint})`).matches;

      if (!isMobile.current && !sliderRef.current.__mouseWatched) {
        sliderRef.current.__mouseWatched = true; // Use a custom property to track
        sliderRef.current.addEventListener('mousemove', onMouseMove);
        sliderRef.current.style.setProperty(
          '--img-prev',
          `url(${images[activeSlideId - 1]})`
        );
        if (contentRef.current) {
          contentRef.current.style.setProperty('transform', `translateZ(${htmlStyles.getPropertyValue('--z-distance')})`);
        }
      } else if (isMobile.current && sliderRef.current.__mouseWatched) {
        sliderRef.current.__mouseWatched = false;
        sliderRef.current.removeEventListener('mousemove', onMouseMove);
        if (contentRef.current) {
          contentRef.current.style.setProperty('transform', 'none');
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => {
      window.removeEventListener('resize', handleResize);
      if (sliderRef.current && sliderRef.current.__mouseWatched) {
        sliderRef.current.removeEventListener('mousemove', onMouseMove);
      }
    };
  }, [onMouseMove, images, activeSlideId]);

  // Auto-slide functionality
  useEffect(() => {
    let timer;
    const autoSlide = () => {
      requestAnimationFrame(() => {
        nextSlide();
      });
      timer = setTimeout(autoSlide, 5000);
    };

    const stopAutoSlide = () => {
      clearTimeout(timer);
      if (sliderRef.current) {
        sliderRef.current.removeEventListener('touchstart', stopAutoSlide);
        sliderRef.current.removeEventListener('mousemove', stopAutoSlide);
      }
    };

    if (sliderRef.current) {
      sliderRef.current.addEventListener('mousemove', stopAutoSlide);
      sliderRef.current.addEventListener('touchstart', stopAutoSlide);
    }

    timer = setTimeout(autoSlide, 2000);

    return () => {
      clearTimeout(timer);
      if (sliderRef.current) {
        sliderRef.current.removeEventListener('mousemove', stopAutoSlide);
        sliderRef.current.removeEventListener('touchstart', stopAutoSlide);
      }
    };
  }, [nextSlide]);

  return (
    <>
    
    
    <div
  
      id="slider"
      className="slider"
      ref={sliderRef}
      style={{ '--img-prev': `url(${images[activeSlideId - 1]})` }}
      
    >

      <div id="slider-content" className="slider__content" ref={contentRef}>
     
        <div className="slider__images">
          {images.map((val, i) => (
            <div
              key={i}
              className={`${IMG_CLASS} ${activeSlideId === i + 1 ? ACTIVE_IMG_CLASS : ''}`}
              data-id={i + 1}
              ref={activeSlideId === i + 1 ? activeImgRef : null} // Assign ref to active image
            >
              <img src={val} alt={`Slide ${i + 1}`} />
            </div>
          ))}
        </div>

        

        <div className="slider__text">
          {Object.entries(text).map(([key, val], i) => (
            <div
              key={i}
              className={`${TEXT_CLASS} ${activeSlideId === i + 1 ? ACTIVE_TEXT_CLASS : ''}`}
              data-id={i + 1}
              ref={activeSlideId === i + 1 ? activeTextRef : null} // Assign ref to active text
            >
              <div className="slider__text-item-head">
                <h3>{key}</h3>
              </div>
              <div className="slider__text-item-info">
                <p>{val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="slider__nav">
        <div className="slider__nav-arrows">
          <div id="left" className="slider__nav-arrow slider__nav-arrow--left" onClick={prevSlide}>
            to left
          </div>
          <div id="right" className="slider__nav-arrow slider__nav-arrow--right" onClick={nextSlide}>
            to right
          </div>
        </div>
        <div id="slider-dots" className="slider__nav-dots" onClick={onDotClick}>
          {images.map((_, i) => (
            <div
              key={i}
              className={`slider__nav-dot ${activeSlideId === i + 1 ? 'slider__nav-dot--active' : ''}`}
              data-id={i + 1}
            ></div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default Slider;