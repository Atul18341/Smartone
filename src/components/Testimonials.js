import React, { useEffect, useRef, useState } from 'react';
import './Testimonials.css'; // Import your CSS file for styling

const testimonials = [
  "https://plus.unsplash.com/premium_photo-1664475536921-e8e0e194be65?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGVkdWNhdGlvbiUyMGV2ZW50fGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1615109398623-88346a601842?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG1hbnxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1480429370139-e0132c086e2a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWFufGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1557862921-37829c790f19?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFufGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVvcGxlfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVvcGxlfGVufDB8fDB8fHww",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQi2Mm5P8j09P4hPKa1B-t9eIOHzHmR7IBkw&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGDbfkDitf-iTCbEzZBYauVuG3w9tt7utYwA&s"
];

const Testimonials = () => {
  const containerRef = useRef(null);
  const [direction, setDirection] = useState('forward');

  useEffect(() => {
    const container = containerRef.current;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const numImages = testimonials.length;
    const scrollDuration = 40000 * (maxScroll / (numImages * 600)); // Adjusted duration based on the number of images and container width
  
    let start = null;
  
    const scroll = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
  
      let scrollAmount = (progress / scrollDuration) * maxScroll; // Adjusted duration
  
      container.scrollTo({
        left: scrollAmount % maxScroll,
        behavior: 'auto' // instant change for smooth loop
      });
  
      if (progress >= scrollDuration) { // Reset position when reaching end
        container.scrollTo({ left: 0, behavior: 'auto' });
        start = null;
        requestAnimationFrame(scroll); // Restart animation
      } else {
        requestAnimationFrame(scroll);
      }
    };
  
    requestAnimationFrame(scroll);
  }, [testimonials]);

  return (
    <section className="py-8 h-full bg-gray-100">
      <h2 className="text-3xl text-center mb-10">Testimonials</h2>
      <div
        className="flex overflow-x-scroll gap-8 justify-center space-x-4 px-4 mb-4 hide-scrollbar"
        ref={containerRef}
        id="testimonialContainer"
      >
       {testimonials.map((src, index) => (
  <div key={index} className="w-1/3 h-64 flex-col flex-shrink-0 flex items-center justify-center">
    <div className="square">
      <img
        className="w-full h-full object-cover rounded-full"
        src={src}
        alt={`Testimonial ${index + 1}`}
      />
    </div>
    <p className="mt-2 text-center text-gray-600 text"><p>Long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum.</p></p>
  </div>
))}

      </div>
    </section>
  );
};

export default Testimonials;
