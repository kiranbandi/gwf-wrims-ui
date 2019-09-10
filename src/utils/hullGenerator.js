export function twoPointHull(hullPoints, hullPadding) {

    var vecScale = function (scale, v) {
        // Returns the vector 'v' scaled by 'scale'.
        return [ scale * v[0], scale * v[1] ];
    }
    
    
    var vecSum = function (pv1, pv2) {
        // Returns the sum of two vectors, or a combination of a point and a vector.
        return [ pv1[0] + pv2[0], pv1[1] + pv2[1] ];
    }
    
    
    var unitNormal = function (p0, p1) {
        // Returns the unit normal to the line segment from p0 to p1.
        var n = [ p0[1] - p1[1], p1[0] - p0[0] ];
        var nLength = Math.sqrt (n[0]*n[0] + n[1]*n[1]);
        return [ n[0] / nLength, n[1] / nLength ];
    };

    // Returns the path for a rounded hull around two points (a "capsule" shape).

    var offsetVector = vecScale(hullPadding, unitNormal(hullPoints[0], hullPoints[1]));
    var invOffsetVector = vecScale(-1, offsetVector);

    var p0 = vecSum (hullPoints[0], offsetVector);
    var p1 = vecSum (hullPoints[1], offsetVector);
    var p2 = vecSum (hullPoints[1], invOffsetVector);
    var p3 = vecSum (hullPoints[0], invOffsetVector);

    return ('M ' + p0
        + ' L ' + p1 + ' A ' + [hullPadding, hullPadding, '0,0,0', p2].join(',')
        + ' L ' + p3 + ' A ' + [hullPadding, hullPadding, '0,0,0', p0].join(','));
}

export function onePointHull (hullPoint, hullPadding) {
    // Returns the path for a rounded hull around a single point (a circle).

    var p1 = [hullPoint[0][0], hullPoint[0][1] - hullPadding];
    var p2 = [hullPoint[0][0], hullPoint[0][1] + hullPadding];

    return 'M ' + p1
        + ' A ' + [hullPadding, hullPadding, '0,0,0', p2].join(',')
        + ' A ' + [hullPadding, hullPadding, '0,0,0', p1].join(',');
};