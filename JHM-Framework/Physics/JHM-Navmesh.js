
GenerateBorderTriangles = function(window)
{
    var width = window.GetWidth()-5;
    var height = window.GetHeight()-5;

    var topLeft = new Vector2(5, 5);
    var topRight = new Vector2(width, 5);
    var bottomRight = new Vector2(width, height);
    var bottomLeft = new Vector2(5, height);

    var centre = new TriangleEdge(bottomRight, topLeft);
    var top = new TriangleEdge(topLeft, topRight);
    var right = new TriangleEdge(topRight, bottomRight);
    var left = new TriangleEdge(topLeft, bottomLeft);
    var bottom = new TriangleEdge(bottomLeft, bottomRight);

    new Triangle(top,right,centre);
    new Triangle(left,centre,bottom);
}

GenerateTestTriangle = function(window)
{
    var width = window.GetWidth() * 0.10 + Math.random() * window.GetWidth()*0.10;
    var height = window.GetHeight() * 0.10 + Math.random() * window.GetHeight()*0.10;

    var topLeft = new Vector2(Math.random() * window.GetWidth() * 0.9, Math.random() * window.GetHeight()*0.9);
    var bottomRight = new Vector2(topLeft.x + width, topLeft.y + height);
    var topRight = new Vector2(topLeft.x + width, topLeft.y);

    var centre = new TriangleEdge(bottomRight, topLeft);
    var top = new TriangleEdge(topLeft, topRight);
    var right = new TriangleEdge(topRight, bottomRight);

    var t = new Triangle(top,right,centre);
    t.SetColor("#000000");
    console.log("Spawning triangle at x/y: " + topLeft.x + " / " + topLeft.y);
    return t;
}

GenerateTestTriangleStatic = function(window)
{
    var width = window.GetWidth() * 0.20;
    var height = window.GetHeight() * 0.16;

    var topLeft = new Vector2(window.GetWidth() * 0.60, window.GetHeight()*0.30);
    var bottomRight = new Vector2(topLeft.x + width, topLeft.y + height);
    var topRight = new Vector2(topLeft.x + width, topLeft.y);

    var centre = new TriangleEdge(bottomRight, topLeft);
    var top = new TriangleEdge(topLeft, topRight);
    var right = new TriangleEdge(topRight, bottomRight);

    var t = new Triangle(top,right,centre);
    t.SetColor("#FF6347");
    console.log("Spawning triangle at x/y: " + topLeft.x + " / " + topLeft.y);
    return t;
}




// TODO: Ray casting is NOT stopping mesh generation, fix!
// TODO: Fix mesh inside boxes.
function Navmesh(colliderSets, windowWidth, windowHeight, myWindow)
{
    var colCoords = new Array();
    var cornerA = new Array({x : 0, y : 0});
    var cornerB = new Array({x : windowWidth, y : 0});
    var cornerC = new Array({x : windowWidth, y: windowHeight});
    var cornerD = new Array({x : 0, y : windowHeight});
    
    for (var n = 0; n < colliderSets.length; ++n)
    {
        colCoords.push(colliderSets[n]);
    }
    colCoords.push(cornerA);
    colCoords.push(cornerB);
    colCoords.push(cornerC);
    colCoords.push(cornerD);

    var cells = new Array();
    var ENeighbourType = 
    {
        cell : 0,
        collider : 1
    };
    var Neighbour = function(type, neighbourReference)
    {
        this.type = type;
        this.neighbour = neighbourReference;
    }
    var Cell = function()
    {
        this.coords = new Array(
            {x : 0, y : 0},
            {x : 0, y : 0},
            {x : 0, y : 0}
        );
        // 0 - 1, 1 - 2, 2 - 0
        this.neighbour_0_1 = null;
        this.neightbour_1_2 = null;
        this.neighbour_2_0 = null
    };

    this.GenerateMesh = function()
    {
        var colliderSetIndex = 0;
        var lastCoordIndex = 0; 
        
        cells.push(new Cell());
        cells[0].coords[0] = colCoords[0][0];
        cells[0].coords[1] = colCoords[0][1]; // this.FindPoint(cells[0].coords[0], cells[0].coords[1], 0);
        cells[0].neighbour_0_1 = new Neighbour(ENeighbourType.collider, colCoords[0]);
        cells[0].coords[2] = this.FindPoint(cells[0].coords[0], cells[0].coords[1], cells[0]);
        if (cells[0].coords[2] === false)
        {
            cells.pop();
            return;
        }
        
        for (var n = 1; n < 10; ++n)
        {
            cells.push(new Cell());
            cells[n-1].neighbour_1_2 = new Neighbour(ENeighbourType.cell, cells[n]);
            cells[n].neighbour_0_1 = new Neighbour(ENeighbourType.cell, cells[n-1]);
            cells[n].coords[0] = cells[n-1].coords[1];
            cells[n].coords[1] = cells[n-1].coords[2];
            cells[n].coords[2] = this.FindPoint(cells[n].coords[0], cells[n].coords[1], cells[n]);

        }
        /*
        if (this.PointInNeighbour(cells[1], cells[1].coords[2], false))
        {
            console.log("Point IS IN NEIGHBOR!");
        }
        else console.log("Not in neighbour??");
        */
        // console.log("Cells: " + cells[0].coords[1].x);

        /*
        var pointIndex = this.FindPoint(0, 0, 0);
        console.log("Index A: " + pointIndex);
        lastCoordIndex = pointIndex;
        cells[0].x[1] = colCoords[pointIndex][0].x;
        cells[0].y[1] = colCoords[pointIndex][0].y;

        pointIndex = this.FindPoint(0, lastCoordIndex, lastCoordIndex);
        console.log("Index B: " + pointIndex);
        cells[0].x[2] = colCoords[pointIndex].x[0];
        cells[0].y[2] = colCoords[pointIndex].y[0];

        */
        console.log("Coords: " + cells[0].coords[0].x + " " + cells[0].coords[0].y);
        console.log("Coords: " + cells[0].coords[1].x + " " + cells[0].coords[1].y);
        console.log("Coords: " + cells[0].coords[2].x + " " + cells[0].coords[2].y);
    };

    this.PointInNeighbour = function(cell, coord, showDebug = false)
    {
        if (showDebug)
        {
            console.log("Checking point in neighbour.");
            console.log("Point to check x/y: " + coord.x + " / " + coord.y);
            console.log("Neighbours: " + cell.neighbour_0_1 + ", " +
            cell.neighbour_1_2 + ", " + cell.neighbour_2_0);
        }
        var CheckNeighbour = function(neighbour)
        {
            if (neighbour == null) return false;
            var neighbourReferene = neighbour.neighbour;
            if (neighbourReferene == null) return false;
            if (neighbour.type != ENeighbourType.cell) return false;
            if (showDebug)
            {
                console.log("Neighbor coords (0) x/y: " + neighbourReferene.coords[0].x + " / " + neighbourReferene.coords[0].y);
                console.log("Neighbor coords (1) x/y: " + neighbourReferene.coords[1].x + " / " + neighbourReferene.coords[1].y);
                console.log("Neighbor coords (2) x/y: " + neighbourReferene.coords[2].x + " / " + neighbourReferene.coords[2].y);
            }
            if (neighbourReferene.coords[0] == coord
                ||  neighbourReferene.coords[1] == coord
                ||  neighbourReferene.coords[2] == coord)
                
                {
                    return true;
                }
            }
            if (CheckNeighbour(cell.neighbour_0_1)) return true;
            if (CheckNeighbour(cell.neighbour_1_2)) return true;
            if (CheckNeighbour(cell.neighbour_2_0)) return true;
            return false;
    }

    this.FindPoint = function(originCoordA, originCoordB, cell)
    {
        console.log("origin A x: " +  originCoordA.x);
        var xA = originCoordA.x;
        var yA = originCoordA.y;
        var xB = originCoordB.x;
        var yB = originCoordB.y;
        var pointCandidates = new Array();

        // Iterate through collider sets to find connections.
        for (var n = 0; n < colCoords.length; ++n)
        {
            // if (n == colliderSetIndex) continue;

            // Check the collider set for possible connections.
            for (var i = 0; i < colCoords[n].length; ++i)
            {
                if (this.PointInNeighbour(cell, colCoords[n][i])) continue;

                var xC = colCoords[n][i].x;
                var yC = colCoords[n][i].y;
                // JURYRIGGED SOLUTION to raycasting premature / incorrect collisions. FIX BY ALLOWING RAYCASTING TO IGNORE SELF!
                // TODO: Layer-based & ignore self ray casting
                // TODO: Ray cast returns hit collider / entity. Use to determine if target was hit as opposed to interruption.
                
                var rayStartXA = xA + ((xC -xA)*0.01);
                var rayStartYA = yA + ((yC -yA)*0.01);
                var rayStartXB = xB + ((xC -xB)*0.01);
                var rayStartYB = yB + ((yC -yB)*0.01);

                var rayEndXA = xA + ((xC -xA)*0.99);
                var rayEndYA = yA + ((yC -yA)*0.99);
                var rayEndXB = xB + ((xC -xB)*0.99);
                var rayEndYB = yB + ((yC -yB)*0.99);

                if ((xC == xA && yC == yA)
                ||  (xC == xB && yC == yB))
                {
                    continue;
                }
                {
                    var midPoint = 
                    {
                        x : xA + ((xC - xA) *0.5),
                        y : yA + ((yC - yA) *0.5)
                    };
                    if (this.PointInCollider(midPoint)) continue;
                    midPoint.x = xB + ((xC - xB) / 2);
                    midPoint.y = yB + ((yC - yB) / 2);
                    if (this.PointInCollider(midPoint)) continue;
                }
                // console.log("cast ray: " + new Ray(rayStartXA, rayStartYA, rayEndXA, rayEndYA, 0));
                if ((new Ray(rayStartXA, rayStartYA, rayEndXA, rayEndYA, 300, false).intersectionFound == true)
                    || (new Ray(rayStartXB, rayStartYB, rayEndXA, rayEndYB, 300, false).intersectionFound == true))
                {
                    console.log("Ray intersection found.");
                    continue;
                }
                else
                {
                    pointCandidates.push(colCoords[n][i]);
                }
            }
        }
        if (pointCandidates.length > 0)
        {
            if ((ArrayFindIndex (pointCandidates, originCoordA))
                || (ArrayFindIndex (pointCandidates, originCoordB)))
            {
                ArrayRemoveIndex(pointCandidates, indx);
            }
            return this.Point(pointCandidates, originCoordA);
        }
        console.log("No point found.");
        return false;
    };

    this.Point = function(pointArray, coords)
    {
        var nearestIndex = -1;
        var nearestDistance = 1000000000;
        for (var n = 0; n < pointArray.length; ++n)
        {
            /*
            console.log(colCoords[pointArray[n]].x[i]);
            console.log(colCoords[pointArray[n]].y[i]);
            console.log(pointB.x);
            console.log(pointB.y);
            */
            var dist = DistanceSquared(coords.x, coords.y, pointArray[n].x, pointArray[n].y);

            // console.log("Distance : " + dist);
            if (nearestDistance > dist)
            {
                nearestIndex = n;
                nearestDistance = dist;
            }
        }
        // console.log("nearest index: " + nearestIndex);
        // console.log(nearestDistance);
        return pointArray[nearestIndex];
    };

    this.PointInCollider = function(point)
    {
        var colliders = myWindow.CheckCollidersAtPoint(point.x, point.y);
        if (colliders.length == 0) return false;
        console.log("Collision found @ x/y:" + point.x + "/" + point.y);
        return true;

    };

    this.Draw = function()
    {
        for (var n = 0; n < cells.length; ++n)
        {
            var context = myWindow.GetContext();
            var prevColor = context.strokeStyle;
            context.strokeStyle = "#008000";
            context.beginPath();
            context.moveTo(cells[n].coords[0].x, cells[n].coords[0].y);


            context.lineTo(cells[n].coords[1].x, cells[n].coords[1].y);
            context.lineTo(cells[n].coords[2].x, cells[n].coords[2].y);
            context.lineTo(cells[n].coords[0].x, cells[n].coords[0].y);
            context.stroke();
            context.strokeStyle = prevColor;
        }
    };

    this.GenerateMesh();
}