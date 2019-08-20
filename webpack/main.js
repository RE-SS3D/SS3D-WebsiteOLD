var THREE = require('three');
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
var objects = [];
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
        if (draggable) {
            objects.push( object );
        }
    } );
}
function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set( 1, 2, 3 );
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xa0a0a0 );
    scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );
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
    scene.add( new THREE.CameraHelper( light.shadow.camera ) );
    var light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light );
    //scene.add( new THREE.CameraHelper( light.shadow.camera ) );
    // ground
    var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );
    var grid = new THREE.GridHelper( 10, 20, 0x000000, 0x000000 );
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add( grid );
    // model
    const loadingManager = new THREE.LoadingManager();
    loadingManager.setURLModifier( function( url ) {
        // this function is called for each asset request
        if(url.endsWith('.png')) {
            console.log(url);
            return url;
            //return '/assets/fbx' + url.substring(url.lastIndexOf('/'));
        } else {
            return url;
        }
    } );

    var loader = new FBXLoader(loadingManager);
    loader.setPath('/assets/fbx/');
    //loadObject(loader, 'default_cube.fbx'
    loadObject(loader, 'template-2.8.fbx', false, false);
    loadObject(loader, 'console.fbx');
    loadObject(loader, 'scalpel-v3.fbx');
    loadObject(loader, 'drill-v5.fbx');
    loadObject(loader, 'DisposalOutletHummus.fbx');
    loadObject(loader, 'twintail_extensions.fbx');
    loadObject(loader, 'microwave oven.fbx');
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    container.appendChild( renderer.domElement );
    controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 0, 0 );
    controls.update();
    window.addEventListener( 'resize', onWindowResize, false );

    // drag

    var dragControls = new DragControls( objects, camera, renderer.domElement );
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
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
//
function animate() {
    requestAnimationFrame( animate );
    var delta = clock.getDelta();
    if ( mixer ) mixer.update( delta );
    renderer.render( scene, camera );
    stats.update();
}