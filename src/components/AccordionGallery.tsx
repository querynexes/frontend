import { useState } from 'react';
import graphTransformation from '../assets/gallery/Graph Transformation.webp';
import hardwareCalibration from '../assets/gallery/Hardware Calibration.webp';
import memoryPlanning from '../assets/gallery/Memory Planning.webp';
import edgeDeployment from '../assets/gallery/Edge Deployment.webp';

const galleryItems = [
  {
    id: 1,
    title: 'Graph Transformations',
    image: graphTransformation,
  },
  {
    id: 2,
    title: 'Hardware Calibration',
    image: hardwareCalibration,
  },
  {
    id: 3,
    title: 'Memory Planning',
    image: memoryPlanning,
  },
  {
    id: 4,
    title: 'Edge Deployment',
    image: edgeDeployment,
  },
];

export default function AccordionGallery() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <div
        className="accordion-gallery"
        style={{
          display: 'flex',
          gap: '12px',
          height: '400px',
          width: '100%',
          marginBottom: '64px',
        }}
      >
        {galleryItems.map((item, index) => {
          const isActive = activeIndex === index;

          return (
            <div
              key={item.id}
              onClick={() => setActiveIndex(index)}
              role="button"
              tabIndex={0}
              aria-label={item.title}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setActiveIndex(index); }}
              style={{
                flex: isActive ? '5' : '1',
                transition: 'flex 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '16px',
                cursor: 'pointer',
                backgroundColor: 'var(--bg-secondary, #1a1a1a)',
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: isActive ? 1 : 0.5,
                  transition: 'opacity 0.6s ease',
                  filter: isActive ? 'grayscale(0%)' : 'grayscale(50%)',
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '32px 24px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                  opacity: isActive ? 1 : 0,
                  transition: 'opacity 0.4s ease 0.2s',
                  pointerEvents: 'none',
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontFamily: 'Space Grotesk, sans-serif',
                    color: '#ffffff',
                    fontSize: '20px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.title}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .accordion-gallery {
            height: 300px !important;
            gap: 8px !important;
          }
        }
        @media (max-width: 425px) {
          .accordion-gallery {
            height: 240px !important;
            gap: 6px !important;
            margin-bottom: 40px !important;
          }
        }
        @media (max-width: 375px) {
          .accordion-gallery {
            height: 200px !important;
          }
        }
      `}</style>
    </>
  );
}
