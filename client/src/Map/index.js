import React, { useCallback, useState, useMemo, useRef, useEffect } from "react";
import { useLoadScript, GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import gpxParser from "../Map/GPXparser";
import { get_bounds, convert_to_latlng, get_segments, split_segments } from "../Map/XMLparser"
import "./Map.css";

var colorArray = ['#FF6633', '#000000', '#FF33FF', '#FFFF99', '#00B3E6', 
		  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
		  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
		  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
		  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

const Map = ({gpxFile, selections, viewOnly, returnGpx}) => {
    const mapRef = useRef();
    const onLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    const [count, setCount] = useState(0);
    const [edges, setEdges] = useState([]);
    const [index, setIndex] = useState(0);
    const [polylines, setPolylines] = useState([]);
    const [hasSegmented, setHasSegmented] = useState(0);
    const [updatedGpxFile, setGpxFile] = useState(0);
    const center = useMemo(() => ({lat: 43, lng: -80}), []);
    var polyline = []; 
    var bounds;

    // if user has inputted 2 edges for a new segment, split track
    useEffect(() => {
        if (count >= 2) split_track();
    });
    
    // update map display and return segmented gpx file 
    useEffect(() => { 
        if (hasSegmented) convertToGpx();
     }, [polylines]); 
    
    // return updated gpx file
    useEffect(() => {
        returnGpx(updatedGpxFile);
    }, [updatedGpxFile]);

    // if a new gpxfile is inserted, parse it
    useEffect(() => {
        parseTrack(gpxFile);
        setPolylines(polyline);
    }, [gpxFile]); 

    // load api script
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY
    })
    if (!isLoaded) return <div>Loading..</div>;

    // parse gpx file, create lines of coordinates
    function parseTrack (file) {
        var gpx = new gpxParser(); //Create gpxParser Object
        gpx.parse(file);
        if (gpx.tracks[0] === undefined) {
            console.log("not available");
            return;
        } 
        // console.log(gpxFile);

        // get coordinates of track
        var bound = get_bounds(gpx.tracks[0]);
        var points = convert_to_latlng(gpx.tracks[0].points);
        
        var segments = get_segments(gpx.tracks[0].points);
        var list = split_segments(points,segments);

        // pan map to the track
        var southWest = new window.google.maps.LatLng(bound.s,bound.w);
        var northEast = new window.google.maps.LatLng(bound.n,bound.e); 
        bounds = new window.google.maps.LatLngBounds(southWest,northEast);
        
        // show segments or full track
        if (selections == true){
            for (let i=0; i<list.length; i++){
                polyline.push({points: list[i], index:i});
            }
        } else {
            polyline.push({points: points, index: 0});
        }
        mapRef.current.fitBounds(bounds);
    }
 
    // find coordinates of the edge of the new segments
    function segmentTrack(event, line) {
        if (viewOnly) {
            console.log("view only");
            return;
        }
        setCount(count + 1);
        const lat = event.latLng.lat();
        const lon = event.latLng.lng(); 
        
        // find out the coordinate and segment that the user clicks
        var latlng=event.latLng;
        var needle = {
            minDistance: 9999999999, 
            index: -1,
            latlng: null
        };
        for (let i=0; i<line.points.length; i++){
            var dist = window.google.maps.geometry.spherical.computeDistanceBetween(latlng, line.points[i]);
            if (dist < needle.minDistance){
                needle.minDistance = dist;
                needle.index = i;
                needle.latlng = line.points[i];
            }
        }
        setEdges((current) => [
            ...current,
            needle.index
        ]);
        setIndex(line.index);
    }
    
    // split the segmented line
    function split_track() {
        edges.sort(numberSort);
        var temp = polylines;
        polyline = [];
    
        var counter = 0;
        for (let i=0; i<temp.length; i++){
            if (i == index){
                // split points
                var arr1 = temp[i].points.slice(0,edges[0]);
                var arr2 = temp[i].points.slice(edges[0]-1,edges[1]+1);
                var arr3 = temp[i].points.slice(edges[1],temp[i].length);

                polyline.push({points: arr1, index:counter});
                polyline.push({points: arr2, index:counter+1});
                polyline.push({points: arr3, index:counter+2});
                
                counter += 3;
            } else {
                temp[i].index = counter;
                polyline.push(temp[i]);
                counter++;
            }
        }
        // update map and reset variables
        setPolylines(polyline);
        setEdges([]);
        setCount(0);
        setHasSegmented(1);
    }

    // sorter helper
    function numberSort(a,b) {
        return a - b;
    };

    // function to re-create gpx file from the new points
    function convertToGpx(){
        //console.log(polylines);
        let parser = new window.DOMParser();
        let xml = parser.parseFromString(gpxFile, 'text/xml');

        // delete the segments and roughness of the old gpx file
        let rough = xml.getElementsByTagName("roughness")[0];
        if (rough != null) rough.parentNode.removeChild(rough);
        let segments = xml.getElementsByTagName("trkseg");
        var nodesToDelete = [];
        if (segments != null){
            for (let seg = 0; seg < segments.length; seg++){
                let temp = segments[seg];
                nodesToDelete.push(temp);
            }
        }
        nodesToDelete.forEach(function(element){element.parentNode.removeChild(element)});

        // get the track segments and points
        var roughnesses = [];
        var trk = xml.getElementsByTagName("trk")[0]; 

        for (let seg=0; seg < polylines.length; seg++){
            // create segment node
            var segment = xml.createElement("trkseg");
            let seg_rough = 0;
            for (let i=0; i < polylines[seg].points.length; i++){
                // create trkpt node
                var trkpt = xml.createElement("trkpt");
                trkpt.setAttribute("lon", polylines[seg].points[i].lng());
                trkpt.setAttribute("lat", polylines[seg].points[i].lat());
                trkpt.setAttribute("ele", polylines[seg].points[i].ele);
                trkpt.setAttribute("dist", polylines[seg].points[i].dist);
                trkpt.setAttribute("bear", polylines[seg].points[i].bear);
                trkpt.setAttribute("slope", polylines[seg].points[i].slope);
                trkpt.setAttribute("slope_per", polylines[seg].points[i].slope_per);
                trkpt.setAttribute("rough", polylines[seg].points[i].rough);
                trkpt.setAttribute("seg", polylines[seg].points[i].seg);
                seg_rough = polylines[seg].points[i].seg;
                segment.appendChild(trkpt);
            }
            roughnesses.push(seg_rough);
            trk.appendChild(segment);
        }

        // get roughness array
        let rough_str = '[';
        roughnesses.forEach(function(element){
            rough_str += element;
            rough_str += ',';
        });
        rough_str = rough_str.substring(0,rough_str.length-1) + ']';

        // combine the strings
        var roughness = xml.createElement("roughness");
        roughness.textContent = rough_str;
        trk.appendChild(roughness);

        // convert string to xml
        var XML = new XMLSerializer().serializeToString(xml);
        setGpxFile(XML);
    }

    return (
        <div className="map_container">
            <GoogleMap 
                zoom={10} 
                center={center} 
                mapContainerClassName="map_container"
                onLoad={onLoad}>
                {polylines.map((line) => (
                    <Polyline
                    key={line.index}
                    path={line.points}
                    options={{
                        strokeColor: colorArray[line.index],
                        strokeOpacity: 0.75,
                        strokeWeight: 5
                    }}
                    onClick={(event) => segmentTrack(event, line)}
                    />
                ))}
            </GoogleMap>
        </div>
    );
}
      
export default Map;
