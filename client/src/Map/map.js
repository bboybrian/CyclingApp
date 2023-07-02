var colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
		  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
		  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
		  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
		  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

var points = [];
var main_polyline;
var polylines = [];

var current_polylines = [];

var mapProp;
var map;
var bounds;

var new_segments = [];
var has_segmented = false;

// Function to load and display Google Map
function myMap() {
    mapProp= {
      center:new google.maps.LatLng(51.508742,-0.120850),
      zoom:5,
    };
    map = new google.maps.Map(document.getElementById("map"),mapProp);
}

// Load gpx file when user inputs file
$(document).ready(function(){
    $("#fileinput").change(function() { 
        loadFile($("#fileinput")[0], parseTrack)
    });
});

// Display the gpx track to google map
function parseTrack(xml)
{
    map = new google.maps.Map(document.getElementById("map"),mapProp);
    polylines = [];
    var gpx = new gpxParser(); //Create gpxParser Object
    gpx.parse(xml);

    var bound = get_bounds(gpx.tracks[0]);
    points = convert_to_latlng(gpx.tracks[0].points);

    var segments = get_segemnts(gpx.tracks[0].points);
    var list = split_segments(points,segments);

    const size = points.length / 2;
    var left = points.slice(0,size);
    var right = points.slice(size,points.length);
    var test = left.slice(0,left.length/2);
    
    var myLatlng = new google.maps.LatLng(-34.397, 150.644);
    var myOptions = {
      zoom: 8,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
        
    var southWest = new google.maps.LatLng(bound.s,bound.w);
    var northEast = new google.maps.LatLng(bound.n,bound.e);
    bounds = new google.maps.LatLngBounds(southWest,northEast);
    map.fitBounds(bounds);

    for (let i=0; i < list.length; i++)
    {
        var color = colorArray[i % 50];
        var flightPath = new google.maps.Polyline({
            path: list[i],
            strokeColor: color,
            strokeOpacity: 2.5,
            strokeWeight: 6,
            index: i
        });
        // flightPath.setMap(map);
        polylines.push(flightPath);
    }

    main_polyline = new google.maps.Polyline({
        path: points,
        strokeColor: "#FF0000",
        strokeOpacity: 2.5,
        strokeWeight: 6,
        index: 0
    });
    displayFullTrack();
    // displaySegmentedTrack();
    // add_selection();
}

// Display track outline 
function displayFullTrack()
{
    // clearMap();
    map = new google.maps.Map(document.getElementById("map"),mapProp);
    map.fitBounds(bounds);

    current_polylines = [];
    current_polylines.push(main_polyline);
    display();
    has_segmented = false;
    if (main_polyline.listener == true)
    {
        console.log("event listener still here");
        google.maps.event.clearInstanceListeners(main_polyline);
    }
    // console.log(current_polylines);
}

// Display segmented track outline
function displaySegmentedTrack()
{
    clearMap();
    current_polylines = polylines;
    display();
    has_segmented = false;
    // console.log(current_polylines);
}

function display()
{
    console.log("imma display " + current_polylines.length);
    for (let i=0; i<current_polylines.length; i++)
    {
        current_polylines[i].setMap(map);
    }
    new_segments = [];
}

// Clear map of main route
function clearMap()
{
    for (let i=0; i<current_polylines.length; i++)
    {
        current_polylines[i].setMap(null);
    }
}

// Thicken the segment when it is selected
function add_selection()
{
    for (let i=0; i < polylines.length; i++)
    {
        polylines[i].addListener("click", function(h) {
            this.setMap(null);
            console.log(this.getPath());
            var flightPath2 = new google.maps.Polyline({
                path: this.getPath(),
                strokeColor: this.strokeColor,
                strokeOpacity: 2.5,
                strokeWeight: this.strokeWeight * 2,
                index: this.index
            });
            flightPath2.setMap(map);
        });
    }
}

// Create a new segment in the track
function set_segment(points, colour) {
    var flightPath = new google.maps.Polyline({
        path: points,
        strokeColor: colour,
        strokeOpacity: 2.5,
        strokeWeight: 6,
        });
    // flightPath.setMap(map);
    return flightPath;
} 

// Function to create a new segment based on the points the user clicks
function segment()
{
    if (has_segmented == false)
    {
        for (let i=0; i<current_polylines.length; i++)
        {
            current_polylines[i].addListener("click", function handler(evt){
                get_coordinates(evt,i,current_polylines[i]);
                current_polylines[i].listener = true;
                for (let j=0; j<current_polylines.length; j++)
                {
                    current_polylines[i].removeEventListener("click",handler);
                }
            });
        }
        has_segmented = true;
    }
}

// Get coordinates of the clicked location
// https://stackoverflow.com/questions/35287330/selecting-section-of-polyline-google-maps-api
function get_coordinates(entity,ind,polyline)
{
    var latlng=entity.latLng;
    var needle = {
        minDistance: 9999999999, //silly high
        index: -1,
        latlng: null
    };
    polyline.getPath().forEach(function(routePoint, index){
        var dist = google.maps.geometry.spherical.computeDistanceBetween(latlng, routePoint);
        if (dist < needle.minDistance){
            needle.minDistance = dist;
            needle.index = index;
            needle.latlng = routePoint;
        }
    });

    var polyline_points = polyline.getPath().getArray();
    console.log(polyline_points);
    var len = polyline_points.length;
    // The closest point in the polyline
    //alert("Closest index: " + needle.index);
    // The clicked point on the polyline
    alert(needle.index);
    var marker = new google.maps.Marker({
        position: needle.latlng,
    });
    marker.setMap(map);
    new_segments.push(needle.index);

    // if 2 points are already set, create a segment between them
    if (new_segments.length == 2)
    {
        var no_of_polylines = current_polylines.length;
        // console.log("creating line" + no_of_polylines);
        new_segments.sort(numberSort);
        var segment_points = [];

        var temp = current_polylines;
        console.log("temp: " + temp);
        polylines = [];

        var counter = 0;
        for (let i=0; i<no_of_polylines; i++)
        {
            if (i == ind){
                console.log("indexes:" + new_segments[0] + " " + new_segments[1]);

                var arr1 = polyline_points.slice(0,new_segments[0]);
                segment_points = polyline_points.slice(new_segments[0]-1,new_segments[1]+1);
                var arr2 = polyline_points.slice(new_segments[1],len);

                console.log(arr1);
                console.log(segment_points);
                console.log(arr2);

                var poly1 = set_segment(arr1,colorArray[4]);
                var poly2 = set_segment(segment_points,colorArray[5]);
                var poly3 = set_segment(arr2,colorArray[6]);

                polylines.push(poly1);
                polylines.push(poly2);
                polylines.push(poly3);

                counter = counter + 3;

            } else {
                temp[i].index = counter;
                polylines.push(temp[i]);
                counter++;
            }
        }
        
        // for (let i = new_segments[0]; i <= new_segments[1]; i++)
        // {
        //     segment_points.push(polyline_points[i]);
        // }
        // console.log(arr1);
        // console.log(arr2);
        // segment_segment(segment_points);
        new_segments = [];
        displaySegmentedTrack();
    }
}

// Function to divide the polylines
function segment_segment(points)
{
    // Get the coordinates between the start and end point
    var flightPath = new google.maps.Polyline({
        path: points,
        strokeColor: "#000000",
        strokeOpacity: 2.5,
        strokeWeight: 6,
        });
    flightPath.setMap(map);
    new_segments = [];
}

numberSort = function (a,b) {
    return a - b;
};