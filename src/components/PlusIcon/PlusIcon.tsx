'use client';

interface PlusIconProps {
  className?: string;
  size?: number;
}

export function PlusIcon({ className, size = 6 }: PlusIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 6 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 1.97307V0H2V1.97307H0V3.94615H2V5.91925H4V3.94615H6V1.97307H4Z"
        fill="currentColor"
      />
    </svg>
  );
}
