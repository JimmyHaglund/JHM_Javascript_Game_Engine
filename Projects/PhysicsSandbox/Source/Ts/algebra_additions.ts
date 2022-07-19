// Accepts a point and two points defining a line. Returns the point on the line that is closes to the provided point.
let closestPointOnLine = (targetX: number, targetY: number, linePointAX: number, linePointAY: number, linePointBX: number, linePointBY: number): { x: number, y: number } => {
   let relativePoint = {
      x: targetX - linePointAX,
      y: targetY - linePointAY
   };
   let relativeLine = { 
      x: linePointBX - linePointAX,
      y: linePointBY - linePointAY
   };
   let projection = (project(relativePoint.x, relativePoint.y, relativeLine.x, relativeLine.y));

   return {
      x: linePointAX + projection.x,
      y: linePointAY + projection.y
   };
}

let project = (targetX, targetY, projectOnX, projectOnY): {x: number, y: number} => {
   let dot = targetX * projectOnX + targetY * projectOnY;
   let pLengthSquared = projectOnX * projectOnX + projectOnY * projectOnY;
   let length = dot / (pLengthSquared);
   return {
      x: projectOnX * length,
      y: projectOnY * length
   };
}