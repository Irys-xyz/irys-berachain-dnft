// Heading.tsx
import React from "react";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface HeadingProps {
  level: HeadingLevel;
  className?: string;
  children: React.ReactNode;
}

const getHeadingClasses = (level: HeadingLevel): string => {
  switch (level) {
    case "h1":
      return "text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight";
    case "h2":
      return "text-6xl font-bold";
    case "h3":
      return "text-4xl font-bold";
    case "h4":
      return "text-base font-bold";
    case "h5":
      return "text-lg font-medium mb-0.5";
    case "h6":
      return "text-base font-normal mb-0.5";
    default:
      return "";
  }
};

const Heading: React.FC<HeadingProps> = ({ level, className, children }) => {
  // Determine the HTML tag based on the level prop
  const Tag = level;

  // Get the classes for the specific heading level
  const headingClasses = getHeadingClasses(level);

  return <Tag className={`${headingClasses} ${className}`}>{children}</Tag>;
};

export default Heading;
