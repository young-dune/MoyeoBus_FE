type DropDownIconProps = {
  size?: number;
  className?: string;
};

export default function DropDownIcon({
  size = 9,
  className = "",
}: DropDownIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={(size * 5) / 9}
      viewBox="0 0 9 5"
      fill="none"
      className={className}
    >
      <path
        d="M0.5 4.5L4.5 0.5L8.5 4.5"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
