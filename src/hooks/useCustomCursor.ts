import { useEffect, useRef } from 'react';

export function useCustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ mx: -100, my: -100, ox: -100, oy: -100 });
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (window.innerWidth <= 768) return;
    let disposed = false;

    const onMove = (e: MouseEvent) => {
      posRef.current.mx = e.clientX;
      posRef.current.my = e.clientY;
    };
    document.addEventListener('mousemove', onMove, { passive: true });

    const animate = () => {
      if (disposed) return;
      const { mx, my } = posRef.current;
      posRef.current.ox += (mx - posRef.current.ox) * 0.15;
      posRef.current.oy += (my - posRef.current.oy) * 0.15;
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
      disposed = true;
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return { outerRef, innerRef };
}
