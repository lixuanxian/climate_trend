"use strict";

//var MODEL_PATH = null;
var SP = null;
var MB = null;
var loader = null;
var SCENE = null;
var DAE = null;
var light1 = null;
var light2 = null;

function loadFBXModel(scene, path)
{
    report("loadFBXModel "+scene+" "+path);
    //var path = './DomeSpace.fbx';
    var manager = new THREE.LoadingManager();
    manager.onProgress = function( item, loaded, total ) {
	console.log( item, loaded, total );
    };
    var loader = new THREE.FBXLoader( manager );
    loader.load( path,
        function( object ) {
           /*
	     object.mixer = new THREE.AnimationMixer( object );
	     mixers.push( object.mixer );
	     var action = object.mixer.clipAction( object.animations[ 0 ] );
	     action.play();
	   */
	    scene.add( object );
	},
        function() {
	},
	function (e) {
	    report("Error loading FBX file "+path+"\n"+e);
	}
	);
}

function loadColladaModel(scene, path)
{
    report("loadColladaModel "+scene+" "+path);
    var imageSource = imageSrc;
    loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    //loader.load( './DomeSpace.dae', function ( collada ) {
    loader.load( path, function ( collada ) {
	report("***** Got Collada *****");
	var dae = collada.scene;
	DAE = dae;
	dae.traverse( function ( child ) {
	    if ( child instanceof THREE.SkinnedMesh ) {
		var animation = new THREE.Animation( child, child.geometry.animation );
		animation.play();
	    }
	} );
	var s = 0.002 * 2.5;
	dae.scale.x = dae.scale.y = dae.scale.z = s;
	dae.position.x = 2;
	dae.position.z = -5.5;
	dae.position.y = -2;
	dae.rotation.y = toRadians(-90);
	dae.updateMatrix();
	scene.add(dae);
//	init();
//	animate();
    } );
}

function loadModel(scene, path)
{
    if (path.endsWith(".fbx")) {
	loadFBXModel(scene, path);
    }
    else if (path.endsWith(".dae")) {
	loadColladaModel(scene, path);
    }
    else {
	report("Unknown model type "+path);
    }
}

function addMovie(scene)
{
    report("addMovie "+scene);
    var imageSource = imageSrc;
    var texture = imageSource.createTexture();
    var material = new THREE.MeshBasicMaterial({
	    map: texture,
	    side: THREE.DoubleSide,
    });
    var r = 1.0;
    var thLen = toRadians(60);
    var phLen = toRadians(40);
    var thMin = toRadians(90)-thLen/2;
    var phMin = toRadians(90)-phLen/2;
    var sphere = new THREE.Mesh(
	new THREE.SphereGeometry(r, 40, 40,
				 thMin, thLen, phMin, phLen),
	    material
	);
    sphere.scale.x = -1;
    var f = 5.0;
    sphere.scale.x *= f;
    sphere.scale.y *= f;
    sphere.scale.z *= f;
    //sphere.position.y = -2.5;
    sphere.position.y = 0;
    sphere.name = "sphere";
    SP = sphere;
    SP.rotation.y = toRadians(90);
    SP.position.x = -2;
    SP.position.y = -1.0;
    var obj = new THREE.Object3D();
    obj.add(SP);
    obj.rotation.z = toRadians(25);
    //scene.add(sphere);
    scene.add(obj);
}

function loadPlayStuff(three, mathbox)
{
    MB = mathbox;
    var scene = three.scene;
    addMovie(scene);
    report("***************************** MODEL_PATH: "+MODEL_PATH);
    if (MODEL_PATH) {
	loadModel(scene, MODEL_PATH);
    }

    var sphere = new THREE.SphereGeometry( 0.5, 16, 8 );

    var color1 = 0xffaaaa;
    light1 = new THREE.PointLight( color1, 2, 50 );
    light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: color1 } ) ) );
    light1.position.y = 30;
    light1.position.x = -10;
    scene.add( light1 );
		
    var color2 = 0xaaffaa;
    light2 = new THREE.PointLight( color2, 2, 50 );
    light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: color2 } ) ) );
    light2.position.y = 30;
    light2.position.x = -10;
    light2.position.z = 5;
    scene.add( light2 );
}
