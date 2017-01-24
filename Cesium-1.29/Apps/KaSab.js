/**
 * Created by thanhqhc on 1/23/17.
 */


var osmb = new OSMBuildings({
    baseURL: './OSMBuildings',
    zoom: 18,
    minZoom: 16,
    maxZoom: 20,
    position: { latitude:10.7625102, longitude:106.6827251 },
    state: false, // stores map position/rotation in url
//            effects: ['shadows']
    backgroundColor: "#27ae60",
    style: { color: 'rgb(220, 210, 200)' }
});

var map = document.getElementById('map');
console.log(map);
osmb.appendTo(map);

osmb.addMapTiles(
    'https://{s}.tiles.mapbox.com/v3/osmbuildings.kbpalbpk/{z}/{x}/{y}.png',
    {
        attribution: '© Data <a href="http://openstreetmap.org/copyright/">OpenStreetMap</a> · © Map <a href="http://mapbox.com">Mapbox</a>'
    }
);

osmb.on('move', function (e) {
    console.log(e.detail);
});

function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'geoJSON.json', true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {

            // .open will NOT return a value but simply returns undefined in async mode so use a callback
            callback(xobj.responseText);

        }
    }
    xobj.send(null);

}

// Call to function with anonymous callback
loadJSON(function(respone) {
    // Do Something with the response e.g.

    var geojson = JSON.parse(respone);
    osmb.addGeoJSON(geojson);
});



osmb.addOBJ('people.obj',
    {
        latitude: 10.7625102,
        longitude: 106.6827251
    }, {
        id: "my_object_1",
        color: 'red',
        elevation: 10,
        rotation: 0.5
    }
);



// var geojson = {
//     type: 'FeatureCollection',
//     features: [
//         {
//             type: 'Feature',
//             properties: {
//                 color: '#ff0000',
//                 roofColor: '#00ff00',
//                 height: 80,
//                 minHeight: 0,
//                 fadeIn: true,
//                 id: "TruongDHKHTN"
//             },
//             geometry: {
//                 type: 'Polygon',
//                 coordinates: [
//                     [
//                         revserLocation(10.762783, 106.682561),
//                         revserLocation(10.762531, 106.682667),
//                         revserLocation(10.762327, 106.682277),
//                         revserLocation(10.762653, 106.682132),
//                         revserLocation(10.762783, 106.682561),
//                     ]
//                 ]
//             }
//         }
//     ]
// };

//        osmb.click(function (e) {
//            console.log(e);
//        });


//,
//,