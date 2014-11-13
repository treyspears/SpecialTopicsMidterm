var scene;
var camera;
var renderer;
var mesh;

var grid1Meshes = [];
var grid2Meshes = [];
var grid3Meshes = [];

var grid1Colors = [];
var grid2Colors = [];
var grid3Colors = [];

var GRID_SIZE   = 4096;
var GRID_SIZE_INVERSE = 1.0 / GRID_SIZE;
var XY_BITMASK  = 63;
var Y_BITSHIFT  = 6; 

/*var GRID_SIZE   = 16384;
var GRID_SIZE_INVERSE = 1.0 / GRID_SIZE;
var XY_BITMASK  = 127;
var Y_BITSHIFT  = 7; */

var cameraPosition =
{
    X: 0,
    Y: 0,
    Z: -96
}

var originalCameraPosition = cameraPosition;
var CPUBenchmarkTextMesh;
var GPUBenchmarkTextMesh;


function init() {
   
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    scene = new THREE.Scene();
    
    //var startColor = new THREE.Color( 1, 0, 0 );
    //var endColor = new THREE.Color( 0, 0, 0 );
    
    var tileColor = new THREE.Color( 0, 0, 0 );
    
    makeGrid( tileColor, -128, -32, grid1Meshes );
    makeGrid( tileColor, -32,  -32, grid2Meshes );
    makeGrid( tileColor, 64,   -32, grid3Meshes );
    
    
    scene.add( CPUBenchmarkTextMesh );
    scene.add( GPUBenchmarkTextMesh );
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0xd9d7d7, 1 )

    document.body.appendChild( renderer.domElement );
    
    renderer.domElement.requestFullscreen = renderer.domElement.requestFullScreen ||
                                            renderer.domElement.mozRequestFullscreen ||
                                            renderer.domElement.webkitRequestFullscreen ||
                                            renderer.domElement.msRequestFullscreen;  
    
    document.exitFullscreen               = document.exitFullScreen ||
                                            document.mozCancelFullScreen ||
                                            document.webkitExitFullscreen;
                                            
    document.fullscreenEnabled            = document.fullscreenEnabled ||
                                            document.mozFullScreenEnabled ||
                                            document.webkitFullscreenEnabled;
                                            
    document.addEventListener( 'wekbitfullscreenchange', function(){ console.log( "Fullscreen has changed" ); } );
    window.addEventListener( 'resize', onWindowResize, false );
}


function onWindowResize()
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}


function makeGrid( colorOfTiles, offsetX, offsetY, meshes )
{
    var geometry;
    var material;
      
    for( var i = 0; i < GRID_SIZE; ++i )
    {        
        geometry    = new THREE.BoxGeometry( 1, 1, 1 );
        material    = new THREE.MeshBasicMaterial( { color: colorOfTiles, wireframe: false } );
        mesh        = new THREE.Mesh( geometry, material );
    
        scene.add( mesh );
        meshes.push( mesh );    
    }
    
    for( var i = 0; i < GRID_SIZE; ++i )  
    {
       meshes[ i ].position.x  = offsetX + ( i & XY_BITMASK );
       meshes[ i ].position.y  = offsetY + ( ( i >>> Y_BITSHIFT ) & XY_BITMASK );
    }
}


function animate() {

    requestAnimationFrame( animate );

    camera.position.x = -cameraPosition.X;
    camera.position.y = -cameraPosition.Y; 
    camera.position.z = -cameraPosition.Z;
    

    renderer.render( scene, camera );
}


var onKeyDown = function( eventArgs )
{    
    if ( String.fromCharCode( eventArgs.keyCode ) === 'W' )
    {
        cameraPosition.Z += 10.0;
    }
    else if ( String.fromCharCode( eventArgs.keyCode ) === 'S' )
    {
        cameraPosition.Z -= 10.0;
    }
    
    if ( String.fromCharCode( eventArgs.keyCode ) === 'A' )
    {
        cameraPosition.X += 10.0;
    }
    else if ( String.fromCharCode( eventArgs.keyCode ) === 'D' )
    {
        cameraPosition.X -= 10.0;
    }
    else if ( String.fromCharCode( eventArgs.keyCode ) === 'Q' )
    {
        cameraPosition.Y -= 10.0;
    }
    else if ( String.fromCharCode( eventArgs.keyCode ) === 'E' )
    {
        cameraPosition.Y += 10.0;
    }
    
      if ( ( event.keyCode === 32 ) || ( String.fromCharCode( event.keyCode ) === 'F' ) )
    {
        renderer.domElement.requestFullscreen();
    }
    else if ( ( String.fromCharCode( event.keyCode ) === 'X' ) )
    {
        document.exitFullscreen();
    }
}

var onKeyUp = function( eventArgs )
{

}


document.addEventListener( "keydown", onKeyDown );
document.addEventListener( "keyup", onKeyUp );

init();
animate();