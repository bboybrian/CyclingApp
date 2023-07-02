// https://gist.github.com/maxim75/1000135/e75e4e840b267706e27bd005569ad9947a8632e2

// Start DOM Parser
if(typeof(DOMParser) == 'undefined') {
    DOMParser = function() {}
    DOMParser.prototype.parseFromString = function(str, contentType) {
        if(typeof(ActiveXObject) != 'undefined') 
        {
            var xmldata = new window.ActiveXObject('MSXML.DomDocument');
            xmldata.async = false;
            xmldata.loadXML(str);
            return xmldata;
        } else if(typeof(XMLHttpRequest) != 'undefined') 
        {
            var xmldata = new XMLHttpRequest;
            if(!contentType) {
            contentType = 'application/xml';
        }
            xmldata.open('GET', 'data:' + contentType + ';charset=utf-8,' + encodeURIComponent(str), false);
            if(xmldata.overrideMimeType) {
                xmldata.overrideMimeType(contentType);
            }
            xmldata.send(null);
            return xmldata.responseXML;
        }
    }
}

// get points of the track
export function convert_to_latlng(segment)
{
    var result = [];
    for(var i=0; i<segment.length; i++)
    {
        // add data to points
        var temp = new window.google.maps.LatLng(segment[i].lat, segment[i].lon);
        temp['ele'] = segment[i].ele;
        temp['time'] = segment[i].time;
        temp['seg'] = segment[i].seg;
        temp['dist'] = segment[i].dist;
        temp['bear'] = segment[i].bear;
        temp['slope'] = segment[i].slope;
        temp['slope_per'] = segment[i].slope_per;
        temp['rough'] = segment[i].rough;
        result.push(temp); 
    }
    return result;
}

// split the points by segments
export function split_segments(points, segments)
{
    var segmented = [], segment_list = [];
    var segment = segments[0];
    for (let i=0; i < points.length; i++)
    {
        segment_list.push(points[i]);
        if (segments[i] != segment)
        {
            segment_list.push(points[i+1]);
            segmented.push(segment_list);
            segment = segments[i];
            segment_list = [];
        } 
    }
    segmented.push(segment_list);
    return segmented;
}

// get number of segments
export function get_segments(segment)
{
    var result = [];
    for(var i=0; i<segment.length; i++)
    {
        result.push(segment[i].seg);
    }
    return result; 
}

// get coordinates of the new centred point of map
export function get_bounds(gpx_data)
{
    var result = { s: 90.0, n: -90, e: -180.0, w: 180.0 };
    for(var i=0; i<gpx_data.points.length; i++)
    {
        var point = gpx_data.points[i];
        if(result.s > point.lat) result.s = point.lat;
        if(result.n < point.lat) result.n = point.lat;
        if(result.e < point.lon) result.e = point.lon;
        if(result.w > point.lon) result.w = point.lon;

    }	
    return result;
}