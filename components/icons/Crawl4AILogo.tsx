"use client";

export default function Crawl4AILogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      fill="none"
      className={className}
    >
      {/* Simple geometric design representing crawling/web */}
      <circle cx="25" cy="25" r="20" fill="currentColor" opacity="0.2" />
      <path
        d="M25 5 L25 45 M5 25 L45 25"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M15 15 L35 35 M35 15 L15 35"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="25" cy="25" r="5" fill="currentColor" />
      <circle cx="15" cy="15" r="3" fill="currentColor" />
      <circle cx="35" cy="15" r="3" fill="currentColor" />
      <circle cx="15" cy="35" r="3" fill="currentColor" />
      <circle cx="35" cy="35" r="3" fill="currentColor" />
    </svg>
  );
}
