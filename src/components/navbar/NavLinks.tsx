
import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState, useLayoutEffect } from "react";

export function NavLinks() {
  const location = useLocation();
  const [activeIdx, setActiveIdx] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [measurements, setMeasurements] = useState<{left: number, width: number}[]>([]);
  
  const links = [
    { name: "Home", path: "/" },
    { name: "Markets", path: "/markets" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Favorites", path: "/favorites" },
    { name: "News", path: "/news" },
  ];
  
  // This effect runs when location changes to update the active index
  useEffect(() => {
    const idx = links.findIndex(link => link.path === location.pathname);
    if (idx !== -1) {
      setActiveIdx(idx);
    }
  }, [location.pathname]);
  
  // Separate initialization of linkRefs to avoid re-renders
  useEffect(() => {
    linkRefs.current = linkRefs.current.slice(0, links.length);
  }, [links.length]);
  
  // Measure the actual text width and position
  // Using useLayoutEffect to ensure measurements are taken before browser paint
  useLayoutEffect(() => {
    // Skip if refs aren't populated yet
    if (!navRef.current || linkRefs.current.some(ref => !ref)) return;
    
    // Create a new array to hold measurements
    const newMeasurements = linkRefs.current.map(ref => {
      if (!ref) return { left: 0, width: 0 };
      
      // Get only the text element inside the link
      const textElement = ref.querySelector('.relative.z-10');
      if (!textElement) return { left: 0, width: 0 };
      
      const textRect = textElement.getBoundingClientRect();
      const linkRect = ref.getBoundingClientRect();
      
      // Calculate the offset of the text from the left of the link
      return {
        left: textRect.left - linkRect.left,
        width: textRect.width,
      };
    });
    
    // Only update state if measurements have actually changed
    const hasMeasurementsChanged = newMeasurements.some((m, i) => {
      const oldM = measurements[i];
      if (!oldM) return true;
      return oldM.left !== m.left || oldM.width !== m.width;
    });
    
    if (hasMeasurementsChanged) {
      setMeasurements(newMeasurements);
    }
  }, [links, measurements]);
  
  // Calculate the absolute position of the active underline
  const getUnderlinePosition = () => {
    if (!navRef.current || activeIdx < 0 || !linkRefs.current[activeIdx]) {
      return { left: '0%', width: '0%' };
    }
    
    const activeLink = linkRefs.current[activeIdx];
    const navWidth = navRef.current.clientWidth;
    
    if (!activeLink || !measurements[activeIdx]) {
      return { left: '0%', width: '0%' };
    }
    
    // Get the current link's position
    const linkRect = activeLink.getBoundingClientRect();
    const navRect = navRef.current.getBoundingClientRect();
    
    // Calculate the relative position
    const linkOffset = linkRect.left - navRect.left;
    const leftPos = linkOffset + (measurements[activeIdx]?.left || 0);
    const widthVal = measurements[activeIdx]?.width || 0;
    
    return {
      left: `${leftPos}px`,
      width: `${widthVal}px`,
    };
  };
  
  const underlinePosition = getUnderlinePosition();
  
  return (
    <nav 
      ref={navRef}
      className="hidden md:flex items-center space-x-8 lg:space-x-10 relative"
    >
      <div 
        className="absolute bottom-0 h-0.5 bg-gradient-to-r from-purple-500/90 via-primary to-blue-500/80 transition-all duration-500 nav-underline"
        style={{
          left: underlinePosition.left,
          width: underlinePosition.width,
          transform: 'translateX(0)',
          boxShadow: '0 1px 8px rgba(124, 58, 237, 0.4)'
        }}
      />
      
      {links.map((link, idx) => (
        <Link
          key={link.path}
          to={link.path}
          ref={el => {
            linkRefs.current[idx] = el;
          }}
          className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 
            ${location.pathname === link.path 
              ? "text-foreground nav-link-active" 
              : "text-muted-foreground hover:text-foreground/90"
            }
          `}
          onMouseEnter={() => setHoveredIdx(idx)}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <span className="relative z-10">
            {link.name}
          </span>
          
          {hoveredIdx === idx && location.pathname !== link.path && (
            <div 
              className="absolute bottom-0 h-0.5 bg-gradient-to-r from-purple-500/40 via-primary/40 to-blue-500/40 animate-navHoverIn"
              style={{
                left: `${measurements[idx]?.left || 0}px`,
                width: `${measurements[idx]?.width || 0}px`
              }}
            />
          )}
        </Link>
      ))}
    </nav>
  );
}
