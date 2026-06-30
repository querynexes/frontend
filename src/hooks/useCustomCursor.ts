// Custom cursor removed per QA request. Restore from git history if needed.
import { useRef } from 'react';

export function useCustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  return { outerRef, innerRef };
}
