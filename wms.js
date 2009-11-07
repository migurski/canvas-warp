var mm = com.modestmaps;

var WMSProvider = function(base, width, height)
{
    var zoom = Math.ceil(Math.log(Math.max(width, height)) / Math.LN2);

    // we're pretending to be dealing with degrees but really they're pixels
    var t = mm.Transformation.prototype.deriveTransformation(0, 0, 0, 0, width * Math.PI/180, 0, width, 0, 0, height * Math.PI/180, 0, height);
    this.projection = new mm.LinearProjection(zoom, t);
    this.bottomright = new mm.Coordinate(height, width, zoom);
    
    var provider = this;
    
    this.getTileUrl = function(coord)
    {
        var scale = Math.pow(2, provider.bottomright.zoomBy(-8).zoom - coord.zoom);
        var w = provider.bottomright.column;
        var h = provider.bottomright.row;
        var z = provider.bottomright.zoom;

        var left = coord.zoomTo(z).column;
        var top = coord.zoomTo(z).row;
        var right = coord.right().zoomTo(z).column;
        var bottom = coord.down().zoomTo(z).row;
        
        top = h - top;
        bottom = h - bottom;

        return [ base + '?FORMAT=image%2Fjpeg&STATUS=unwarped&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&STYLES=&EXCEPTIONS=application%2Fvnd.ogc.se_inimage&SRS=EPSG%3A4326&WIDTH=256&HEIGHT=256&BBOX=' + [left, bottom, right, top].join(',') ];
    }
};

com.modestmaps.extend(WMSProvider, com.modestmaps.MapProvider);
