import { HTMLAttributes } from "react";

export default function Crawl4AIIcon({
  fill = "var(--heat-100)",
  innerFillColor = "var(--background-base)",
  ...attrs
}: HTMLAttributes<HTMLOrSVGElement> & {
  innerFillColor?: string;
  fill?: string;
}) {
  return (
    <svg
      {...attrs}
      height="600"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 600 600"
      width="600"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        {/* Outer web/network design */}
        <circle cx="300" cy="300" r="200" fill={fill} opacity="0.3" />
        
        {/* Cross lines representing crawling paths */}
        <path
          d="M 100 300 L 500 300 M 300 100 L 300 500"
          stroke={fill}
          strokeWidth="8"
          strokeLinecap="round"
        />
        
        {/* Diagonal lines */}
        <path
          d="M 150 150 L 450 450 M 450 150 L 150 450"
          stroke={fill}
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.6"
        />
        
        {/* Center node */}
        <circle cx="300" cy="300" r="30" fill={fill} />
        
        {/* Corner nodes */}
        <circle cx="150" cy="150" r="20" fill={fill} />
        <circle cx="450" cy="150" r="20" fill={fill} />
        <circle cx="150" cy="450" r="20" fill={fill} />
        <circle cx="450" cy="450" r="20" fill={fill} />
        
        {/* Edge nodes */}
        <circle cx="300" cy="100" r="15" fill={fill} />
        <circle cx="500" cy="300" r="15" fill={fill} />
        <circle cx="300" cy="500" r="15" fill={fill} />
        <circle cx="100" cy="300" r="15" fill={fill} />
        
        {/* Inner overlay */}
        <circle cx="300" cy="300" r="20" fill={innerFillColor} />
      </g>
    </svg>
  );
}
