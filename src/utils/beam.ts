// // utils/beam.ts

// export const Side = {
//   Top: "top",
//   Bottom: "bottom",
//   Left: "left",
//   Right: "right",
// } as const;
// export type Side = typeof Side[keyof typeof Side];

// // Map sides to normal vectors (direction of exit/entry)
// const SideVectors = {
//   [Side.Top]: { x: 0, y: -1 },
//   [Side.Bottom]: { x: 0, y: 1 },
//   [Side.Left]: { x: -1, y: 0 },
//   [Side.Right]: { x: 1, y: 0 },
// };

// export const getPathData = (
//   container: DOMRect,
//   from: DOMRect,
//   to: DOMRect,
//   fromSide: Side,
//   toSide: Side,
//   curvature: number
// ): string => {
//   // 1. Calculate Start/End Coordinates relative to container
//   // We use offsets to center the point on the specific side
  
//   const getCoords = (rect: DOMRect, side: Side) => {
//     const x = rect.left - container.left;
//     const y = rect.top - container.top;
    
//     switch (side) {
//       case Side.Top: return { x: x + rect.width / 2, y: y };
//       case Side.Bottom: return { x: x + rect.width / 2, y: y + rect.height };
//       case Side.Left: return { x: x, y: y + rect.height / 2 };
//       case Side.Right: return { x: x + rect.width, y: y + rect.height / 2 };
//       default: throw new Error("Invalid side");
//     }
//   };

//   const start = getCoords(from, fromSide);
//   const end = getCoords(to, toSide);

//   // 2. Calculate Control Points
//   // CP = Point + (Vector * Curvature)
//   const startVec = SideVectors[fromSide];
//   const endVec = SideVectors[toSide];

//   const cp1 = {
//     x: start.x + startVec.x * curvature,
//     y: start.y + startVec.y * curvature,
//   };
  
//   // Note: For the 'end' point, the vector is usually inverted if we think of 'entry',
//   // but simpler to think of it as "sticking out" from the side. 
//   // Standard Bezier logic pulls 'away' from the point.
//   const cp2 = {
//     x: end.x + endVec.x * curvature,
//     y: end.y + endVec.y * curvature,
//   };

//   return `M ${start.x},${start.y} C ${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${end.x},${end.y}`;
// };

// utils/beam.ts

export const Side = {
  Top: "top",
  Bottom: "bottom",
  Left: "left",
  Right: "right",
} as const;
export type Side = typeof Side[keyof typeof Side];

// Helper to get the center or specific anchor points of an element
export const getElementCoords = (
  element: HTMLElement,
  container: HTMLElement,
  side: Side = Side.Right
) => {
  const rect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  const x = rect.left - containerRect.left;
  const y = rect.top - containerRect.top;
  const w = rect.width;
  const h = rect.height;

  // Calculate based on the specific side requested
  switch (side) {
    case Side.Top:
      return { x: x + w / 2, y: y };
    case Side.Bottom:
      return { x: x + w / 2, y: y + h };
    case Side.Left:
      return { x: x, y: y + h / 2 };
    case Side.Right:
      return { x: x + w, y: y + h / 2 };
    default:
      return { x: x + w / 2, y: y + h / 2 };
  }
};

/**
 * Generates an SVG path string for an orthogonal (90-degree) connector
 * with rounded corners.
 */
export const getOrthogonalPath = (
  start: { x: number; y: number },
  end: { x: number; y: number },
  cornerRadius: number = 20
): string => {
  const { x: x1, y: y1 } = start;
  const { x: x2, y: y2 } = end;

  // Determine orientation based on distance
  // If horizontal distance is greater, we generally move horizontal first (Z-shape)
  // Unless perfectly aligned vertically.
  const isHorizontal = Math.abs(x2 - x1) > Math.abs(y2 - y1);

  const w = Math.abs(x2 - x1);
  const h = Math.abs(y2 - y1);
  // Clamp radius to prevent weird loops if points are too close
  const r = Math.min(cornerRadius, w / 2, h / 2);

  let path = "";

  if (isHorizontal) {
    // HORIZONTAL Logic (Z-shape or S-shape)
    // Move Horizontal -> Arc -> Vertical -> Arc -> Horizontal
    const midX = x1 + (x2 - x1) / 2;

    // Start
    path += `M ${x1} ${y1} `;

    // Leg 1: Move horizontally to first turn
    const corner1X = x1 < x2 ? midX - r : midX + r;
    path += `L ${corner1X} ${y1} `;

    // Turn 1: Arc to vertical
    // Control point is (midX, y1)
    const corner1Y = y1 < y2 ? y1 + r : y1 - r;
    path += `Q ${midX} ${y1} ${midX} ${corner1Y} `;

    // Leg 2: Move vertically to second turn
    const corner2Y = y1 < y2 ? y2 - r : y2 + r;
    path += `L ${midX} ${corner2Y} `;

    // Turn 2: Arc to horizontal
    // Control point is (midX, y2)
    const corner2X = x1 < x2 ? midX + r : midX - r;
    path += `Q ${midX} ${y2} ${corner2X} ${y2} `;

    // Leg 3: Move to end
    path += `L ${x2} ${y2} `;

  } else {
    // VERTICAL Logic (C-shape or reverse S-shape)
    // Move Vertical -> Arc -> Horizontal -> Arc -> Vertical
    const midY = y1 + (y2 - y1) / 2;

    // Start
    path += `M ${x1} ${y1} `;

    // Leg 1: Move vertically to first turn
    const corner1Y = y1 < y2 ? midY - r : midY + r;
    path += `L ${x1} ${corner1Y} `;

    // Turn 1: Arc to horizontal
    // Control point is (x1, midY)
    const corner1X = x1 < x2 ? x1 + r : x1 - r;
    path += `Q ${x1} ${midY} ${corner1X} ${midY} `;

    // Leg 2: Move horizontally to second turn
    const corner2X = x1 < x2 ? x2 - r : x2 + r;
    path += `L ${corner2X} ${midY} `;

    // Turn 2: Arc to vertical
    // Control point is (x2, midY)
    const corner2Y = y1 < y2 ? midY + r : midY - r;
    path += `Q ${x2} ${midY} ${x2} ${corner2Y} `;

    // Leg 3: Move to end
    path += `L ${x2} ${y2} `;
  }

  return path;
};