console.log("HELLO WORLD");
//var webpack = require('webpack');
var THREE = require('three');

//import * as THREE from '../assets/js/threejs/three.module.js';
//import Stats from './threejs/stats.module.js';
//import { OrbitControls } from './threejs/OrbitControls.js';
//import  FBXLoader  from './threejs/FBXLoader.js';
//var FBXLoader = require('./threejs/FBXLoader.js');
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//import { FBXLoader } from 'three/examples/jsm/loader/FBXLoader.js';

//var OrbitControls = require('three/OrbitControls');
//var FBXLoader = require('three/FBXLoader');
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
var container, stats, controls;
var camera, scene, renderer, light;
var clock = new THREE.Clock();
var mixer;
init();
animate();
function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set( 100, 200, 300 );
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xa0a0a0 );
    scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );
    light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    light.position.set( 0, 200, 0 );
    scene.add( light );
    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 200, 100 );
    light.castShadow = true;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = - 100;
    light.shadow.camera.left = - 120;
    light.shadow.camera.right = 120;
    scene.add( light );
    // scene.add( new CameraHelper( light.shadow.camera ) );
    // ground
    var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );
    var grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add( grid );
    // model
    var loader = new FBXLoader();
    loader.load( '/assets/fbx/console.fbx', function ( object ) {
        object.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        } );
        scene.add( object );
    } );
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    container.appendChild( renderer.domElement );
    controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 100, 0 );
    controls.update();
    window.addEventListener( 'resize', onWindowResize, false );
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