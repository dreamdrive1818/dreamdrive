import React, { useRef, useEffect, useState } from "react";

const AnimateOnScroll = ({ children, className = "", delay = 0 }) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay * 1000);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? "fade-in-bottom" : "hidden-init"} animateonscroll`}
    >
      {children}
    </div>
  );
};

export default AnimateOnScroll;
