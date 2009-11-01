var Circle = function(center, radius)
{
    this.center = center;
    this.radius = radius;
}

function circumcircle(p1, p2, p3)
{
    var x1 = p1.x;
    var y1 = p1.y;
    var x2 = p2.x;
    var y2 = p2.y;
    var x3 = p3.x;
    var y3 = p3.y;
    
    var sq = function(x) { return Math.pow(x, 2); };
    
    var d = 2 * (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
    var x = ((sq(y1) + sq(x1)) * (y2 - y3) + (sq(y2) + sq(x2)) * (y3 - y1) + (sq(y3) + sq(x3)) * (y1 - y2)) / d;
    var y = ((sq(y1) + sq(x1)) * (x3 - x2) + (sq(y2) + sq(x2)) * (x1 - x3) + (sq(y3) + sq(x3)) * (x2 - x1)) / d;

    var r1 = Math.sqrt(sq(x1 - x) + sq(y1 - y));
    var r2 = Math.sqrt(sq(x2 - x) + sq(y2 - y));
    var r3 = Math.sqrt(sq(x3 - x) + sq(y3 - y));
    
    var r = (r1 + r2 + r3) / 3;
    
    return new Circle({x: x, y: y}, r);
}

function inCircle(point, circle)
{
    var distance = Math.sqrt(Math.pow(point.x - circle.center.x, 2) + Math.pow(point.y - circle.center.y, 2));
    return distance < circle.radius;
}

/**
*/
function addPoint(point, triangles)
{
    var edges = [];
    
    for(var i = 0; i < triangles.length; i += 1)
    {
        var tri = triangles[i];
        var cc = circumcircle(tri[0], tri[1], tri[2]);

        if(inCircle(point, cc))
        {
            edges.push([tri[0], tri[1]]);
            edges.push([tri[1], tri[2]]);
            edges.push([tri[2], tri[0]]);
            triangles.splice(i, 1);
            i -= 1;
        }
    }
    
    var allEdges = edges;
    var uniqEdges = [];
    
    for(var i = 0; i < edges.length; i += 1)
    {
        var unique = true;
        
        for(var j = 0; j < edges.length; j += 1)
        {
            if(i != j && edgesMatch(edges[i], edges[j]))
            {
                unique = false;
            }
        }
        
        if(unique)
        {
            uniqEdges.push(edges[i]);
        }
    }
    
    edges = uniqEdges;
    
    while(edges.length)
    {
        var e = edges.pop();
        var tri = [point, e[0], e[1]];
        triangles.push(tri);
    }
}

function edgesMatch(e1, e2)
{
    var e1p1 = e1[0];
    var e1p2 = e1[1];
    var e2p1 = e2[0];
    var e2p2 = e2[1];
    
    return ((e1p1.x == e2p1.x && e1p1.y == e2p1.y  &&  e1p2.x == e2p2.x && e1p2.y == e2p2.y)
         || (e1p1.x == e2p2.x && e1p1.y == e2p2.y  &&  e1p2.x == e2p1.x && e1p2.y == e2p1.y));
}

function drawTriangle(c, p1, p2, p3)
{
    c.beginPath();
    c.moveTo(p1.x, p1.y);
    c.lineTo(p2.x, p2.y);
    c.lineTo(p3.x, p3.y);
    c.lineTo(p1.x, p1.y);
    c.closePath();
    c.strokeStyle = '#999';
    c.stroke();
}
