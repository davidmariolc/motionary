const markPoints = [
  [3, 23],
  [3, 5],
  [8, 5],
  [14, 15],
  [20, 5],
  [25, 5],
  [25, 23],
  [20, 23],
  [20, 13],
  [14, 22],
  [8, 13],
  [8, 23],
] as const;

export const fullScreenPolygon =
  "polygon(0% 100%, 0% 0%, 25% 0%, 50% 0%, 75% 0%, 100% 0%, 100% 100%, 75% 100%, 65% 100%, 50% 100%, 35% 100%, 25% 100%)";

export const getMarkPolygon = (
  centerX: number,
  centerY: number,
  size: number
): string => {
  const unit = size / 28;
  const points = markPoints.map(
    ([x, y]) => `${centerX + (x - 14) * unit}px ${centerY + (y - 14) * unit}px`
  );
  return `polygon(${points.join(", ")})`;
};

const transform = (x: number, y: number, scale: number): string =>
  `translate(${x}px, ${y}px) scale(${scale})`;

export const getIntroGeometry = (
  brand: DOMRect,
  mark: DOMRect,
  viewportWidth: number,
  viewportHeight: number
) => {
  const markSize = viewportWidth < 640 ? 64 : 96;
  const startScale = markSize / Math.min(mark.width, mark.height);
  const centerScale = Math.min(
    startScale,
    420 / brand.width,
    (viewportWidth - 48) / brand.width
  );
  const markX = mark.left - brand.left + mark.width / 2;
  const markY = mark.top - brand.top + mark.height / 2;
  const startX = viewportWidth / 2 - markX * startScale;
  const startY = viewportHeight / 2 - markY * startScale;
  const centerX = (viewportWidth - brand.width * centerScale) / 2;
  const centerY = (viewportHeight - brand.height * centerScale) / 2;
  return {
    center: transform(centerX, centerY, centerScale),
    destination: transform(brand.left, brand.top, 1),
    polygon: getMarkPolygon(viewportWidth / 2, viewportHeight / 2, markSize),
    start: transform(startX, startY, startScale),
    surfaceCenter: transform(
      centerX + markX * centerScale - viewportWidth / 2,
      centerY + markY * centerScale - viewportHeight / 2,
      centerScale / startScale
    ),
  };
};
