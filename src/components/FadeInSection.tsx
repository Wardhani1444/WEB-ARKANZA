import React from 'react';
import { motion, MotionProps } from 'motion/react';

interface FadeInSectionProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'none';
  distance?: number;
  id?: string;
}

/**
 * Reusable wrapper component that provides a smooth, premium fade-in
 * entrance animation as elements enter the viewport during scrolling.
 */
export const FadeInSection: React.FC<FadeInSectionProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 28,
  id,
  ...props
}) => {
  const initialY = direction === 'up' ? distance : direction === 'down' ? -distance : 0;

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: initialY }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px', amount: 0.1 }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
