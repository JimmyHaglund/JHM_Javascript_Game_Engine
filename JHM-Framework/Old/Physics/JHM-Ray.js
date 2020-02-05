var rays = new Array();
var colSets;
function UpdateRayColliders()
{
    colSets = gameWindow.GetColliderSets();
}

function RayTick()
{
    for (var n = 0; n < rays.length; ++n)
    {
        rays[n].Tick();
    }
}

function Ray(startX, startY, endX, endY, FrameDuration = 1, debugMessage = false, rayWindow)
{
    var window = rayWindow;
    var intersectionFound = false;
    if (debugMessage)
    {
        console.log("Raycasting points x/y : " + 
        startX + " / " + startY + " to " +
        endX + " / " + endY);
    }
    var collisionFound = false;
    rays.push(this);
    
    var rayA = 
    {
        x : startX,
        y : startY
    };
    var rayB = 
    {
        x : endX,
        y : endY
    };
    var rayDeltaX = Math.round(rayB.x*100) - Math.round(rayA.x*100);
    // console.log("Creating new ray spanning " + rayA.x + ","+rayA.y + " to " + rayB.x + "," + rayB.y);
    this.Destroy = function()
    {
        // console.log("Destroying ray: " + this);
        var myIndex = ArrayFindIndex(rays, this);
        ArrayRemoveIndex(rays, myIndex);
    };
    
    this.Draw = function()
    {
        var context = gameWindow.GetContext();
        var prevColor = context.strokeStyle;
        context.strokeStyle = "FF0000";
        context.beginPath();
        context.moveTo(rayA.x,rayA.y);
        context.lineTo(rayB.x,rayB.y);
        context.stroke();
        context.strokeStyle = prevColor;
    };

    var Age = 0;
    this.Tick = function()
    {
        if (Age++ >= FrameDuration) this.Destroy();
        else this.Draw();
    };

    var CollisionInfo = function(hitCollider, hitX, hitY)
    {
        this.collider = hitCollider;
        this.point = 
        {
            x : hitX,
            y : hitY
        };
    }

    var FindRayIntersection = function()
    {
        var raySlope;
        if (rayDeltaX != 0) 
        {
            raySlope = ((rayB.y - rayA.y) / (rayB.x-rayA.x));
        }
        var intersectionArray = new Array();
        // Finding all possible intersections with ray in scene.
        for (var n = 0; n < colSets.length; ++n)
        {
            // console.log("Colset: " + n );
            for (var i = 0; i < colSets[n].length; ++i)
            {
                // console.log("Line segment: " + (i+1));
                // console.log("Box y:" + colSets[n].y[i]);;
                var z = i-1;
                if (i === 0) z = colSets[n].length-1;
                var colDeltaX = colSets[n][i].x-colSets[n][z].x;
                var colSetSlope;
                var intersect;
    
                if (colDeltaX === 0)
                {
                    if (rayDeltaX === 0)
                    {
                        continue;
                    }
                    colSetslope = (colSets[n][i].y - colSets[n][z].y) * 10000;
                    intersect = new function()
                    {
                        this.x = colSets[n][i].x;
                        this.y = rayA.y + (this.x - rayA.x) * (rayB.y - rayA.y) / (rayB.x - rayA.x);
                    };
                }
                else 
                {
                    colSetSlope = (colSets[n][i].y-colSets[n][z].y) / (colDeltaX);
                    if (rayDeltaX === 0)
                    {
                        intersect = new function()
                        {
                            this.x = rayA.x;
                            this.y = colSets[n][i].y + (this.x - colSets[n][i].x) * colSetSlope;
                        };
                    }
                    else
                    {
                        // console.log("Running Line Intersect script.");
                        intersect = GetLineIntersect(rayA.x, rayA.y, colSets[n][i].x, colSets[n][i].y, raySlope, colSetSlope);
                        // console.log("Intersect x/Y:" + intersect.x + "/" + intersect.y);
                    }
                }
                // console.log("intersect x: " + intersect.x);
                // console.log("intersect y: " + intersect.y);
                if (intersect == null || intersect.x == null || intersect.y == null
                || (OutsideRange(intersect.x, colSets[n][z].x, colSets[n][i].x))
                || (OutsideRange(intersect.y, colSets[n][z].y, colSets[n][i].y))
                || (OutsideRange(intersect.y, rayA.y, rayB.y))
                || (OutsideRange(intersect.x, rayA.x, rayB.x)))
                {
                    // console.log("Intersect outside allowed range.");
                    continue; 
                }
                else
                {
                    intersectionArray.push(new CollisionInfo(colSets[n], intersect.x, intersect.y));
                }
            }
        }

        var nearestIntersection = null;
        {
            // console.log("# of intersections: " + intersectionArray.length);
            // Find nearest intersection.
            var nearestDistance = 100000000000000;
            for (var q = 0; q < intersectionArray.length; ++q)
            {
                var intersect = intersectionArray[q].point;
                var currentDistance = DistanceSquared(rayA.x, rayA.y, intersect.x, intersect.y);
                if (currentDistance < nearestDistance)
                {
                    nearestDistance = currentDistance;
                    nearestIntersection = intersectionArray[q];
                }
            }
        }

        if (nearestIntersection)
        {
            if (debugMessage)
            {
                console.log("Ray intersection found at x / y: " + 
                nearestIntersection.x + " / " + nearestIntersection.y);
            }
            return nearestIntersection;
        }
        if (debugMessage) console.log("No ray intersection found.");
        return new CollisionInfo(null, null);
    }
    {
        var intersectionFound = FindRayIntersection();
        if (intersectionFound.collider != null)
        {
            rayB = intersectionFound.point;
        }
        return intersectionFound;
    }
}