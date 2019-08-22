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
            if (child.material !== undefined ) {
                child.material.specular = new THREE.Color(0x000000);
                child.material.shininess = 0.0;
                if (child.material.length !== undefined ) {
                    for(var i = 0; i < child.material.length; i++) {
                        child.material[i].specular = new THREE.Color(0x000000);
                        child.material[i].shininess = 0.0;
                    }
                }
            }   
            //if ( child instanceof THREE.Mesh ) {
            //    child.material.envMap =  new THREE.TextureLoader().load( '/assets/fbx/forest.exr' ); 
            //}            
        } );
        scene.add( object );
        fileDict[path] = object;
        if (draggable) {
            draggables.push( object );
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
    if(document.getElementById(element)) {
        document.getElementById(element).checked = true;
    } else {
        console.log("Error: Could not find " + element);
    }
    loadObject(loader,element);
});
for (var i = 0; i < checkboxes.length; i++) {
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
    //scene.fog = new THREE.Fog( backgroundColor, 4, 20 );
    light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    light.position.set( 0, 1, 0 );
    //light.intensity = 1;
    scene.add( light );
    //light = new THREE.DirectionalLight( 0xffffff );
    //light.position.set( 0, 20, 10 );
    //light.castShadow = true;
    //light.intensity = 0.1;
    //light.shadow.camera.top = 18;
    //light.shadow.camera.bottom = - 10;
    //light.shadow.camera.left = - 12;
    //light.shadow.camera.right = 12;
    //scene.add( light );
    //scene.add( new THREE.CameraHelper( light.shadow.camera ) );
    var light = new THREE.AmbientLight( 0x404040 ); // soft white light
    //light.intensity = 1;
    scene.add( light );
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    scene.add( directionalLight );
    var spotLight = new THREE.SpotLight( 0xffffff, 0.5, 50, 1, 0, 1 );
    spotLight.position.set( -8, 15, 8 );
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    scene.add( spotLight );
    //var spotLightHelper = new THREE.SpotLightHelper( spotLight );
    //scene.add( spotLightHelper );
    var spotLight = new THREE.SpotLight( 0xffffff, 0.25, 50, 1, 0, 1 );
    spotLight.position.set( 8, 5, 8 );
    spotLight.castShadow = false;
    scene.add( spotLight );
    //var spotLightHelper = new THREE.SpotLightHelper( spotLight );
    //scene.add( spotLightHelper );
    var spotLight = new THREE.SpotLight( 0xffffff, 0.1, 50, 1, 0, 1 );
    spotLight.position.set( -8, 15, -8 );
    spotLight.castShadow = false;
    scene.add( spotLight );
    //var spotLightHelper = new THREE.SpotLightHelper( spotLight );
    //scene.add( spotLightHelper );
    var grid = new THREE.GridHelper( 20, 20, 0x000000, 0x000000 );
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
    loadObject(loader, 'gridbox.fbx', false, false);
    loadObject(loader, 'human-dummy.fbx', false, true);
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