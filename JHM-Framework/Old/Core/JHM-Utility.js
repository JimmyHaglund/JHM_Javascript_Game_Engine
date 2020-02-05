/**
 * @file Utility.js
*/

/**
 * @function CheckTypeForObject
 * @param {*} value
 * @description Checks if the given type is an object.
 * Throws an error if type is not an object.
 * @returns {object}
 */
function CheckTypeForObject(value)
{
    if(typeof value != 'object')
    {
        throw "Value type error: " + 
            "type is " + typeof value + 
            ", should be object.";
    }
    return value;
}

/**
 * @function CheckTypeForString
 * @param {*} value 
 *  * @description Checks if the given type is a string.
 * Throws an error if type is not a string.
 * @returns {string}
 */
function CheckTypeForString(value)
{
    if (typeof value != 'string')
    {
        throw "Value type error: " + 
            "type is " + typeof value + 
            ", should be string.";
    }
    return value;
}

/**
 * @function CheckTypeForNumber
 * @description Check input type to confirm it's a
 * valid number. Throws an error if not.
 * @param {*} value 
 */
function CheckTypeForNumber(value)
{
    if (typeof value != 'number')
    {
        console.log("Value type error: " +
            " Type is " + value.type + ", should be " +
            " number.");
        // If string, attempt to convert to number
        var foundNumber = 0;
        if (typeof value == 'string')
            foundNumber = -1*(0 - value);
        if (!isNaN(value))
        {
            console.log("Converted string to number: " + 
                foundNumber);
            return foundNumber;
        }
        throw "Type error: value is " + typeof value + ", should be number.";
        return 0;
    }
    else
        return value;
}

/**
 * @function ArrayFindIndex
 * @description
 * Looks through an array for a value.
 * Returns index of object if found,
 * null if not.
 * @param {Array} targetArray 
 * @param {*} value 
 */
function ArrayFindIndex(targetArray, value)
{
    // Check if targetArray is an array object.
    // Throws an error if not.
    if (!(targetArray instanceof Array))
        throw "Error in ArrayFindIndex: inserted array "+
        "is not actually an array.";
    for (var n = 0; n < targetArray.length; ++n)
    {
        if (targetArray[n] == value)
            return n;
    }
    return null;
}
/**
 * @function ArrayRemoveIndex
 * @description
 * Removes value at a target index in an array and returns the removed value.
 * @param {Array} targetArray 
 * @param {Number} index 
 */
function ArrayRemoveIndex(targetArray, index)
{
    // Check number type.
    index = CheckTypeForNumber(index);

    // console.log(targetArray);
    if (index >= targetArray.length)
    {
        // console.log("Array remove component error: Array size is lower than target index!");
        return null;
    }
    else
    {
        var removedValue = targetArray[index];
        for (var n = index; n < targetArray.length - 1; ++n)
        {
            targetArray[n] = targetArray[n+1];
        }
        targetArray.pop();
        return removedValue;
    }
}

function ArrayInsert(targetArray, value, index)
{
    var delta = targetArray.length - index - 1;
    if (delta < 0) return null;
    targetArray.push(targetArray[targetArray.length - 1]);
    for (var n = targetArray.length - 1; n > index; --n)
    {
        targetArray[n] = targetArray[n-1];
    }
    targetArray[index] = value;
}

/**
 * @function PrintProperties
 * @description prints all properties of target object.
 * @param {*} targetObject 
 */
function PrintProperties(targetObject)
{
    for (var propertyKey in targetObject)
    {
        console.log("Property: " + propertyKey +
        "Value: " + targetObject[propertyKey]);
    }
}

function DistanceSquared(xA, yA, xB, yB)
{
    var dist, distX, distY;
    distX = Math.abs(xB - xA);
    distY = Math.abs(yB - yA);
    distTot = (distX*distX + distY*distY);
    return distTot;
}

function OutsideRange(control, rangeA, rangeB)
{
    if (Math.floor(rangeA) === Math.floor(rangeB))
    {
        if (Math.round(rangeA) === Math.round(control))
        {
            return false;
        }
    }

    if (rangeA > rangeB )
    {
        var Q = rangeA;
        rangeA = rangeB;
        rangeB = Q;
    }

    // Compare range.
    if (control < rangeA || control > rangeB)
    {
        // console.log("value: " + control + "outside range: " + rangeA + " - " + rangeB);
        return true;
    }
    return false;
}

/**
 * @description Checks two lines A and B and returns their intersection point, if any.
 * @param {*} originYA 
 * @param {*} originYB 
 * @param {*} leaningCoeffecientA 
 * @param {*} leaningCoeffecientB 
 */
function GetLineIntersect(originXA, originYA, originXB, originYB, leaningCoeffecientA, leaningCoeffecientB)
{
    // If lines are parallell, they won't intersect.
    if (leaningCoeffecientA - leaningCoeffecientB == 0) return null; 
    var intersectPointX = (originYB - originXB * leaningCoeffecientB - originYA + originXA * leaningCoeffecientA) / (leaningCoeffecientA - leaningCoeffecientB);
    
    var intersectCoords = new Vector2
    (
        intersectPointX, 
        originYA + leaningCoeffecientA * (intersectPointX -originXA)
    );
    /*
    {
        this.x = intersectPointX;
        this.y = originYA + leaningCoeffecientA * (intersectPointX -originXA);
    };
    */
    return intersectCoords;
}

Vector2 = function(x, y)
{
    this.x = x;
    this.y = y;

};

GetLeanCoeffecient = function(pointA, pointB)
{
    var lean;
    if(pointB.x - pointA.x === 0) return 1000000;
    else return (pointB.y - pointA.y) / (pointB.x - pointA.x);
};

VectorEquals = function(vectorA, vectorB)
{
    var xa = Math.round(vectorA.x);
    var ya = Math.round(vectorA.y);

    var xb = Math.round(vectorB.x);
    var yb = Math.round(vectorB.y);

    if (xa === xb && ya === yb) return true;
    return false;
}

function SideOfLine(point, lineA, lineB)
{
    return (((point.x - lineB.x) * (lineA.y - lineB.y)) - (lineA.x - lineB.x) * (point.y - lineB.y));
}

function ArrayConcatenate(arrayA, arrayB)
{
    for (var n = 0; n < arrayB.length; ++n)
    {
        arrayA.push(arrayB[n]);
    }
    return arrayA;
}