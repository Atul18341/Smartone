import React from 'react';
import styled, { keyframes } from 'styled-components';

// Keyframes for animations
const fall = keyframes`
  to {
    transform: translate3d(-30em, 0, 0);
  }
`;

const tailFade = keyframes`
  0%, 50% {
    width: var(--star-tail-length);
    opacity: 1;
  }
  70%, 80% {
    width: 0;
    opacity: 0.4;
  }
  100% {
    width: 0;
    opacity: 0;
  }
`;

const blink = keyframes`
  50% {
    opacity: 0.6;
  }
`;

// Styled components
const StarsContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; /* Adjust height to 100% */
  transform: rotate(-45deg);
`;

const Star = styled.div`
  position: absolute;
  top: var(--top-offset);
  left: 0;
  width: var(--star-tail-length);
  height: var(--star-tail-height);
  color: var(--star-color);
  background: linear-gradient(45deg, currentColor, transparent);
  border-radius: 50%;
  filter: drop-shadow(0 0 6px currentColor);
  transform: translate3d(104em, 0, 0);
  animation: ${fall} var(--fall-duration) var(--fall-delay) linear infinite,
    ${tailFade} var(--tail-fade-duration) var(--fall-delay) ease-out infinite;

  @media screen and (max-width: 750px) {
    animation: ${fall} var(--fall-duration) var(--fall-delay) linear infinite;
  }

  &::before,
  &::after {
    position: absolute;
    content: "";
    top: 0;
    left: calc(var(--star-width) / -2);
    width: var(--star-width);
    height: 100%;
    background: linear-gradient(45deg, transparent, currentColor, transparent);
    border-radius: inherit;
    animation: ${blink} 2s linear infinite;
  }

  &::before {
    transform: rotate(45deg);
  }

  &::after {
    transform: rotate(-45deg);
  }
`;

const randomRange = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

const StarComponent = () => {
  const stars = [];
  const starCount = 50;

  for (let i = 0; i < starCount; i++) {
    const starTailLength = randomRange(500, 750) / 100;
    const topOffset = randomRange(0, 10000) / 100;
    const fallDuration = randomRange(6000, 12000) / 1000;
    const fallDelay = randomRange(0, 10000) / 1000;

    stars.push(
      <Star
        key={i}
        style={{
          '--star-tail-length': `${starTailLength}em`,
          '--top-offset': `${topOffset}vh`,
          '--fall-duration': `${fallDuration}s`,
          '--fall-delay': `${fallDelay}s`,
          '--star-color': '#D2E9E9',  // This line sets the star color
          '--star-tail-height': '2px',
          '--star-width': `calc(${starTailLength} / 6)`,
          '--tail-fade-duration': `${fallDuration}s`,
        }}
      />
    );
  }

  return <StarsContainer>{stars}</StarsContainer>;
};

const StyleLogin = () => (
  <div>
    <StarComponent />
  </div>
);

export default StyleLogin;
