
//    var MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoicWhjdGhhbmgiLCJhIjoiY2l5N2lnNmltMDA2ajMyb3h5azc0OW91dSJ9.7EagjkvmpnuRoxc-OBgR7g"
//    var MAPBOX_STYLE_ID = 'ciy7imtm0001e2roouk90mnnh';
//    var MAPBOX_USERNAME = 'qhcthanh';
//
var osm = Cesium.createOpenStreetMapImageryProvider({
    url : 'https://a.tile.openstreetmap.org/'
});

// Mapbox api url

var url = 'https://api.mapbox.com/styles/v1/qhcthanh/ciy84eryo002d2rl9y3fqznkc/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicWhjdGhhbmgiLCJhIjoiY2l5N2lnNmltMDA2ajMyb3h5azc0OW91dSJ9.7EagjkvmpnuRoxc-OBgR7g'
//  url = "'https://a.tile.openstreetmap.org'";

var viewer = new Cesium.Viewer('cesiumContainer',{
    baseLayerPicker : false
});

var layers = viewer.imageryLayers;

var customImageryProvider = new Cesium.UrlTemplateImageryProvider({
    url : url
});
layers.addImageryProvider(customImageryProvider);

var scene = viewer.scene;

scene.globe.tileCacheSize = 250;

var canvas = viewer.canvas;
var camera = scene.camera;
scene.skyAtmosphere.hueShift = -0.1;
scene.skyAtmosphere.saturationShift = -0.08;
scene.skyAtmosphere.brightnessShift = 0.48;

//    scene.screenSpaceCameraController.maximumZoomDistance = 1500.0;
//    scene.screenSpaceCameraController.minimumZoomDistance = 100.0;

var startPosition = {
    coords: {
        latitude:  10.7625102,
        longitude: 106.6827251
    },
    zoom: 300.0
};

createModel("3DObjects/CesiumMan.glb",startPosition,0.0);
// createModel("3DObjects/CesiumMan.glb",{
//     coords: {
//         "longitude": 106.6823575,
//         "latitude": 10.762156
//     },
//     zoom: 100.0
// },0.0);

moveRange(startPosition);

//
// setInterval(function () {
//     startPosition.coords.latitude += 0.00005;
//     startPosition.coords.longitude += 0.00003;
//     console.log("Called");
//     flyTo(startPosition.coords.latitude,startPosition.coords.longitude,startPosition.zoom, -60.0,-15.0, 0.0);
//     // moveRange()
// }, 2 * 1000);

// var dataSource = Cesium.GeoJsonDataSource.load('./geoJSON.json');
var dataSource = Cesium.GeoJsonDataSource.load('./geoJSON.json').then(
    function(dataSource) {

        var p = dataSource.entities.values;
        for (var i = 0; i < p.length; i++) {
            p[i].polygon.extrudedHeight = 20.0 * (i+1); // or height property
            p[i].polygon.material = Cesium.Color.RED;
            p[i].polygon.closeTop = true;
            p[i].polygon.closeBottom = false;
            p[i].polygon.outline = false;
        }
        viewer.dataSources.add(dataSource);
        // viewer.zoomTo(dataSource);
    }
);

// viewer.dataSources.add(dataSource);





function flyTo(lat,lng,zoom, heading, pitch, roll) {

    // entity.position = Cesium.Cartesian3.fromDegrees(lng,lat);
    var human = viewer.entities.getById("human");
    human.position =  Cesium.Cartesian3.fromDegrees(lng,lat);


    if (zoom == null) {
        zoom = viewer.camera.zoom;
    }

    if (heading == null) {
        heading = Cesium.Math.toDegrees(viewer.camera.heading);
        heading = Cesium.Math.toRadians(heading);
    } else {
        heading = Cesium.Math.toRadians(heading);
    }


    if (pitch == null) {
        pitch = Cesium.Math.toDegrees(viewer.camera.pitch);
        pitch = Cesium.Math.toRadians(pitch);
    } else {
        pitch = Cesium.Math.toRadians(pitch);
    }

    zoom += 100;

    viewer.camera.flyTo({
        destination : Cesium.Cartesian3.fromDegrees(lng,lat, zoom),
        orientation : {
            heading : heading,
            pitch : pitch,
            roll : roll
        },
        easingFunction : Cesium.EasingFunction.LINEAR_NONE,
        maximumHeight: zoom
        , completion: function () {

            setTimeout(function () {
                var range = zoom;
                var transform = Cesium.Cartesian3.fromDegrees(lng,lat);
                viewer.camera.lookAt(transform, new Cesium.HeadingPitchRange(heading, pitch, range));
            },500);
        }
    });

}

// Create callback for browser's geolocation
function moveRange(position, heading,pitch) {

    if (heading == null) {
        heading = Cesium.Math.toRadians(-60.0);
    }
    if (pitch == null) {
        pitch = Cesium.Math.toRadians(-80.0);
    }

    var range =     position.zoom;
    var transform = Cesium.Cartesian3.fromDegrees(position.coords.longitude, position.coords.latitude);
    viewer.camera.lookAt(transform, new Cesium.HeadingPitchRange(heading, pitch, range));
};

function createModel(url,position, height) {


    var position = Cesium.Cartesian3.fromDegrees(position.coords.longitude, position.coords.latitude, height);
    var heading = Cesium.Math.toRadians(0);
    var pitch = Cesium.Math.toRadians(0);
    var roll = 0;
    var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

    return viewer.entities.add({
        id: "human",
        name : url,
        position : position,
        orientation : orientation,
        model : {
            uri : url,
            scale : 25.0
        }
    });
}

// Ask browser for location, and fly there.
//navigator.geolocation.getCurrentPosition(fly);

//  scene.screenSpaceCameraController.enableRotate = false;
//  scene.screenSpaceCameraController.enableTranslate = false;
//  scene.screenSpaceCameraController.enableZoom = false;
//  scene.screenSpaceCameraController.enableTilt = false;
//  scene.screenSpaceCameraController.enableLook = false;
//
//  var currentHeading = 0;
//
//  var startMousePosition;
//  var mousePosition;
//  var flags = {
//    looking : false,
//    moveForward : false,
//    moveBackward : false,
//    moveUp : false,
//    moveDown : false,
//    moveLeft : false,
//    moveRight : false
//  };
//
//  var handler = new Cesium.ScreenSpaceEventHandler(canvas);
//
//  handler.setInputAction(function(movement) {
//    flags.looking = true;
//    mousePosition = startMousePosition = Cesium.Cartesian3.clone(movement.position);
//  }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
//
//  handler.setInputAction(function(movement) {
//    mousePosition = movement.endPosition;
//  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
//
//  handler.setInputAction(function(movement) {
//    mousePosition = movement.endPosition;
//    flags.looking = false;
//  }, Cesium.ScreenSpaceEventType.LEFT_UP);
//
//  handler.setInputAction(function(movement) {
//    console.log("PINCH_START");
//    console.log(movement);
//  }, Cesium.ScreenSpaceEventType.PINCH_START);
//
//  handler.setInputAction(function(movement) {
//    console.log("PINCH_MOVE");
//    console.log(movement);
//  }, Cesium.ScreenSpaceEventType.PINCH_MOVE);
//
//  handler.setInputAction(function(movement) {
//    console.log("PINCH_END");
//    console.log(movement);
//  }, Cesium.ScreenSpaceEventType.PINCH_END);
//
//  viewer.clock.onTick.addEventListener(function(clock) {
//    var camera = viewer.camera;
//
//    if (flags.looking) {
//      var width = canvas.clientWidth;
//      var height = canvas.clientHeight;
//
//      // Coordinate (0.0, 0.0) will be where the mouse was clicked.
//      var x = (mousePosition.x - startMousePosition.x) / width;
//      if (mousePosition.x - startMousePosition.x < 0 ) {
//        currentHeading += 5;
//      } else {
//        currentHeading -= 5;
//      }
//
//
//      fly(startPosition,Cesium.Math.toRadians(currentHeading));
//    }
//
//    // Change movement speed based on the distance of the camera to the surface of the ellipsoid.
//    var ellipsoid = scene.globe.ellipsoid;
//    var cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height;
//    var moveRate = cameraHeight / 100.0;
//
//
//
//  });