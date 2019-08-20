// Code heavily inspired from https://github.com/mrdoob/three.js/blob/master/examples/webgl_loader_fbx.html and related files
var THREE = require('three');
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
var draggables = [];
const loadingManager = new THREE.LoadingManager();
const loader = new FBXLoader(loadingManager);
var dragControls;
var container, stats, controls;
var camera, scene, renderer, light;
var clock = new THREE.Clock();
var mixer;
init();
animate();
function loadObject(loader, path, castShadow = true, draggable = true) {
    loader.load( path, function ( object ) {
        console.log("Loading fbx file " + path);
        object.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = castShadow;
                child.receiveShadow = true;
            }
        } );
        scene.add( object );
        fileDict[path] = object;
        if (draggable) {
            console.log("DRAG");
            draggables.push( object );
            console.log(draggables);
        }
    } );
}

function arrayRemoveByUUID(arr, value) {
    return arr.filter(function(ele){
        return ele.uuid != value.uuid;
    });
}

function onModelCheckboxChange() {
    var array = [];
    var checkboxes = document.querySelectorAll('input[name=models]:checked');

    for (var i = 0; i < checkboxes.length; i++) {
        array.push(checkboxes[i].id);
    }

    var newParams;
    if(params.get("scroll"))  {
        newParams = "?f=" + array.join('&f=') + "&scroll=" + params.get("scroll");
    } else {
        newParams = "?f=" + array.join('&f=');
    }
    history.pushState(null, null, newParams);
    if(this.checked) {
        // Checkbox is checked..
        loadObject(loader,(this.id));
    } else {
        // Checkbox is not checked..
        dragControls.dispose();
        scene.remove(fileDict[this.id]);
        draggables = arrayRemoveByUUID(draggables, fileDict[this.id]);
        fileDict[this.id] = undefined;
        dragControls = new DragControls( draggables, camera, renderer.domElement );
        dragControls.addEventListener( 'dragstart', function () {
            controls.enabled = false;
        } );
        dragControls.addEventListener( 'dragend', function () {
            controls.enabled = true;
        } );
    }
}
var checkboxes = document.querySelectorAll("input[name=models]");
var fileDict = {};
let params = new URLSearchParams(location.search.substring(1));
params.getAll("f").forEach(function(element) {
    console.log(element);
    if(document.getElementById(element)) {
        document.getElementById(element).checked = true;
    } else {
        console.log("Error: Could not find " + element);
    }
    loadObject(loader,element);
});
for (var i = 0; i < checkboxes.length; i++) {
    console.log(checkboxes[i]);
    checkboxes[i].addEventListener( 'change', onModelCheckboxChange);
}
function init() {
    container = document.getElementById("canvas-container");
    camera = new THREE.PerspectiveCamera( 45, container.clientWidth / container.clientHeight, 0.3, 1000 );
    camera.position.set( 1, 2, 3 );
    scene = new THREE.Scene();
    var backgroundColor =  new THREE.Color( 0x5F5F5F );
    if(localStorage.getItem("theme")) {
        if(localStorage.getItem("theme") == "light") { 
            backgroundColor = new THREE.Color( 0xa0a0a0 );
        }
    }
    scene.background = backgroundColor;
    scene.fog = new THREE.Fog( backgroundColor, 4, 20 );
    light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    light.position.set( 0, 2, 0 );
    //light.intensity = 1;
    scene.add( light );
    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 20, 10 );
    light.castShadow = true;
    light.intensity = 0.1;
    light.shadow.camera.top = 18;
    light.shadow.camera.bottom = - 10;
    light.shadow.camera.left = - 12;
    light.shadow.camera.right = 12;
    scene.add( light );
    //scene.add( new THREE.CameraHelper( light.shadow.camera ) );
    var light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light );
    // ground
    var groundColor = new THREE.Color( 0x666666);
    if(localStorage.getItem("theme")) {
        if(localStorage.getItem("theme") == "light") { 
            groundColor = new THREE.Color( 0x999999 );
        }
    }
    var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: groundColor, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );
    var grid = new THREE.GridHelper( 10, 20, 0x000000, 0x000000 );
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add( grid );
    // model
    loadingManager.setURLModifier( function( url ) {
        // this function is called for each asset request
        if(url.endsWith('.png')) {
            return url;
            //return '/assets/fbx' + url.substring(url.lastIndexOf('/'));
        } else {
            return url;
        }
    } );

    loader.setPath('/assets/fbx/');
    //loadObject(loader, 'default_cube.fbx'
    //loadObject(loader, 'template-2.8.fbx', false, false);
    //loadObject(loader, 'microwave oven.fbx');
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild( renderer.domElement );
    controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 1, 0 );
    controls.update();
    window.addEventListener( 'resize', onWindowResize, false );

    // drag

    dragControls = new DragControls( draggables, camera, renderer.domElement );
    dragControls.addEventListener( 'dragstart', function () {
        controls.enabled = false;
    } );
    dragControls.addEventListener( 'dragend', function () {
        controls.enabled = true;
    } );

    // stats
    stats = new Stats();
    container.appendChild( stats.dom );
}
function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}
//
function animate() {
    requestAnimationFrame( animate );
    var delta = clock.getDelta();
    if ( mixer ) mixer.update( delta );
    renderer.render( scene, camera );
    stats.update();
}