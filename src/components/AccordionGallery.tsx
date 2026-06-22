import { useState } from 'react';

// Using placeholder images that fit the AI/Tech theme. Replace these URLs with your actual assets.
const galleryItems = [
  {
    id: 1,
    title: 'Graph Transformations',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Hardware Calibration',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Memory Planning',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Edge Deployment',
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=800&auto=format&fit=crop',
  },
];

export default function AccordionGallery() {
  // Set the first item as active by default
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        height: '400px', // Adjust height as needed
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
            style={{
              // The magic happens here: active gets flex 5, inactive gets flex 1
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
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: isActive ? 1 : 0.5,
                transition: 'opacity 0.6s ease',
                filter: isActive ? 'grayscale(0%)' : 'grayscale(50%)', // Optional effect
              }}
            />
            
            {/* Overlay for text */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '32px 24px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                opacity: isActive ? 1 : 0,
                transition: 'opacity 0.4s ease 0.2s', // Delayed fade-in
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
  );
}