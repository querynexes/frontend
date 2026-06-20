import { useEffect, useRef } from 'react';

export function useCustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ mx: -100, my: -100, ox: -100, oy: -100 });
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (window.innerWidth <= 768) return;

    const onMove = (e: MouseEvent) => {
      posRef.current.mx = e.clientX;
      posRef.current.my = e.clientY;
    };
    document.addEventListener('mousemove', onMove);

    const animate = () => {
      const { mx, my } = posRef.current;
      posRef.current.ox += (mx - posRef.current.ox) * 0.1;
      posRef.current.oy += (my - posRef.current.oy) * 0.1;
      if (outerRef.current) {
        outerRef.current.style.left = posRef.current.ox + 'px';
        outerRef.current.style.top = posRef.current.oy + 'px';
      }
      if (innerRef.current) {
        innerRef.current.style.left = mx + 'px';
        innerRef.current.style.top = my + 'px';
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return { outerRef, innerRef };
}
