// A debug version of wouter's Link component
import { Link as WouterLink } from "wouter";
import { useEffect } from "react";

interface DebugLinkProps {
  href: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const DebugLink = ({ href, onClick, children, className }: DebugLinkProps) => {
  useEffect(() => {
    console.log(`Debug Link mounted with href: ${href}`);
  }, [href]);
  
  const handleClick = (e: React.MouseEvent) => {
    console.log(`DebugLink clicked with href: ${href}`);
    
    // Pass click to parent component if provided
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <WouterLink href={href}>
      <a className={className} onClick={handleClick}>
        {children}
      </a>
    </WouterLink>
  );
};

export default DebugLink;