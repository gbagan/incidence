export const roundedRectangle = (x: number, y: number, w: number, h: number, r: number) =>
  [
    'M', x + r, y,
    'H', x + w - r,
    'A', r, r, 0, 0, 1, x + w, y + r,
    'V', y + h - r,
    'A', r, r, 0, 0, 1, x + w - r, y + h,
    'H', x + r,
    'A', r, r, 0, 0, 1, x, y + h - r,
    'V', y + r,
    'A', r, r, 0, 0, 1, x + r, y,
    'Z'
  ].join(' ');

export const roundedPolygon = (cx: number, cy: number, radius: number, sides: number, cornerAngleDeg: number) => {
  const angleStep = (2 * Math.PI) / sides;
  const path = [];
  const cornerAngle = (cornerAngleDeg * Math.PI) / 180;

  for (let i = 0; i < sides; i++) {
    const theta = i * angleStep;
    const p1Angle = theta + cornerAngle / 2;
    const p2Angle = theta - cornerAngle / 2;

    const p1x = cx + radius * Math.cos(p1Angle);
    const p1y = cy + radius * Math.sin(p1Angle);
    const p2x = cx + radius * Math.cos(p2Angle);
    const p2y = cy + radius * Math.sin(p2Angle);

    if (i === 0) {
      path.push(`M ${p2x} ${p2y}`);
    } else {
      path.push(`L ${p2x} ${p2y}`);
    }

    path.push(`A ${radius} ${radius} 0 0 1 ${p1x} ${p1y}`);
  }

  path.push("Z");
  return path.join(" ");
}