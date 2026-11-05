const paths = {
  arrow: "M5 12h14m-6-6 6 6-6 6",
  back: "M19 12H5m6-6-6 6 6 6",
  check: "m5 12 4 4L19 6",
  close: "m6 6 12 12M6 18 18 6",
  copy: "M9 9h12v12H9zM15 5V3H3v12h2",
  diagonal: "M6 18 18 6M6 6h12v12",
  enter: "M4 12h12m-4-4 4 4-4 4M17 4h4v16h-4",
  grid: "M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h6v6h-6z",
  info: "M12 11v6M12 7v.1M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  pause: "M8 5v14M16 5v14",
  play: "m9 5 11 7-11 7Z",
  replay: "M3 10a9 9 0 1 1 2 8M3 4v6h6",
  search: "m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  shapes: "M4 4h8v8H4zM21 16a5 5 0 1 1-10 0 5 5 0 0 1 10 0",
  text: "M4 5h16M12 5v15M8 20h8",
  wave: "M2 12h3l3-7 5 14 3-7h6",
} as const;
export type IconName = keyof typeof paths;
export const Icon = ({
  name,
  size = 18,
}: {
  readonly name: IconName;
  readonly size?: number;
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
};
