import { useCallback } from 'react';

interface LinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Link({ to, children, className, onClick }: LinkProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      window.location.hash = to;
      window.scrollTo(0, 0);
      onClick?.();
    },
    [to, onClick],
  );

  return (
    <a href={`#${to}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
