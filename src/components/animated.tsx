import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function AnimatedButton({ children, onClick, className, ...props }: AnimatedButtonProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
      if (onClick) onClick();
    }, 300);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={isClicked ? { scale: [1, 1.1, 1] } : {}}
    >
      <Button
        onClick={handleClick}
        className={className}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}

interface AnimatedCardProps {
  children: React.ReactNode;
  index?: number;
  className?: string;
}

export function AnimatedCard({ children, index = 0, className = "" }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -10 }}
    >
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${className}`}>
        {children}
      </Card>
    </motion.div>
  );
}

interface RotatingIconProps {
  children: React.ReactNode;
  rotation?: number;
  duration?: number;
}

export function RotatingIcon({ children, rotation = 360, duration = 0.5 }: RotatingIconProps) {
  return (
    <motion.div
      whileHover={{ rotate: rotation }}
      transition={{ duration }}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedBadgeProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function AnimatedBadge({ children, onClick, className }: AnimatedBadgeProps) {
  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={className}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </motion.span>
  );
}