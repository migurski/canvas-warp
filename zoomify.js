var mm = com.modestmaps;

var ZoomifyProvider = function(dir, width, height)
{
    var zoom = Math.ceil(Math.log(Math.max(width, height)) / Math.LN2);

    // we're pretending to be dealing with degrees but really they're pixels
    var t = mm.Transformation.prototype.deriveTransformation(0, 0, 0, 0, width * Math.PI/180, 0, width, 0, 0, height * Math.PI/180, 0, height);
    this.projection = new mm.LinearProjection(zoom, t);
    this.bottomright = new mm.Coordinate(height, width, zoom);
    
    var topLeftOutLimit = new mm.Coordinate(0, 0, 0);
    var bottomRightInLimit = this.bottomright.zoomBy(-8);
    var groups = [];
    var i = 0;
    
   /*
    * Iterate over all possible tiles in order: left to right, top to
    * bottom, zoomed-out to zoomed-in. Note the first tile coordinate
    * in each group of 256.
    */
    for(var c = topLeftOutLimit.copy(); c.zoom <= bottomRightInLimit.zoom; c.zoom += 1)
    {
        // edges of the image at current zoom level
        var tlo = topLeftOutLimit.zoomTo(c.zoom);
        var bri = bottomRightInLimit.zoomTo(c.zoom);
    
        // left-to-right, top-to-bottom, like reading a book
        for(c.row = tlo.row; c.row <= bri.row; c.row += 1)
        {
            for(c.column = tlo.column; c.column <= bri.column; c.column += 1)
            {
                // zoomify groups tiles into folders of 256 each
                if(i % 256 == 0)
                    groups.push(c.copy());
                
                i += 1;
            }
        }   
    }
    
    this.groups = groups;
    var provider = this;
    
    this.getTileUrl = function(coord)
    {
        return [ dir+'/TileGroup'+provider.coordinateGroup(coord)+'/'+(coord.zoom)+'-'+(coord.column)+'-'+(coord.row)+'.jpg' ];
    }
};

com.modestmaps.extend(ZoomifyProvider, com.modestmaps.MapProvider);

ZoomifyProvider.prototype.coordinateGroup = function(c)
{
    for(var i = 0; i < this.groups.length; i += 1)
    {
        if(i + 1 == this.groups.length)
            return i;
    
        var g = this.groups[i + 1].copy();

        if(c.zoom < g.zoom || (c.zoom == g.zoom && (c.row < g.row || (c.row == g.row && c.column < g.column))))
            return i;
    }

    return -1;
}
