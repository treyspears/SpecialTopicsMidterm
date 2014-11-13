var canPerformBenchMark = true;

var kernel_setColor1;
var kernel_setColor2;
var kernel_sumColor;
var webCLGL;

var seed;


function CPU_Benchmark()
{    
    var benchmarkTime = new Date().getTime();
    
    canPerformBenchMark = false;
    
    for( var i = 0; i < GRID_SIZE; ++i )
    {
        for( var j = 0; j < 25600; ++ j )
        {            
            grid1Colors[ i ] = ( j * 0.01 ) << 16;
            grid1Meshes[ i ].material.color.setHex( grid1Colors[ i ] );
        }
    }
    
    for( var i = 0; i < GRID_SIZE; ++i )
    {
        blue = Math.round( Math.random() * 0xff );
        
        for( var j = 0; j < 25600; ++ j )
        {
            grid2Colors[ i ] = ( j * 0.01 );
            grid2Meshes[ i ].material.color.setHex( grid2Colors[ i ] );
        }
    }
    
    for( var i = 0; i < GRID_SIZE; ++i )
    {
        grid3Colors[ i ] = grid1Colors[ i ] | grid2Colors[ i ];
        grid3Meshes[ i ].material.color.setHex( grid3Colors[ i ] );
        
    }
        
    benchmarkTime = new Date().getTime() - benchmarkTime;
    document.getElementById('benchmarkCPU').innerText = benchmarkTime;
    
    canPerformBenchMark = true;
}


function GPU_Benchmark()
{
    canPerformBenchMark = false;
    
    var offset = 16777215;
    
    var result_buffer1 = webCLGL.createBuffer( GRID_SIZE, "FLOAT", offset);
    var result_buffer2 = webCLGL.createBuffer( GRID_SIZE, "FLOAT", offset);
     
    kernel_setColor1.setKernelArg( 0, 65536.0 ); 
    kernel_setColor1.compile();
    

     
    var benchmarkTime = new Date().getTime();   
    
    webCLGL.enqueueNDRangeKernel( kernel_setColor1, result_buffer1 );
        kernel_setColor1.setKernelArg( 0, 0.0 );
    kernel_setColor1.compile();
    
    webCLGL.enqueueNDRangeKernel( kernel_setColor1, result_buffer2 );
  
    
    
    //alert( webCLGL.enqueueReadBuffer_Float( result_buffer2 ) );
    
   
    grid1Colors = webCLGL.enqueueReadBuffer_Float( result_buffer1 );
    grid2Colors = webCLGL.enqueueReadBuffer_Float( result_buffer2 );
    
    benchmarkTime = new Date().getTime() - benchmarkTime;
    document.getElementById('benchmarkGPU').innerText = benchmarkTime;
    

    
    for( var i = 0; i < GRID_SIZE; ++i )
    {
        grid1Colors[ i ] = Math.round( grid1Colors[ i ] );;
        grid2Colors[ i ] = Math.round( grid2Colors[ i ] );
        grid1Meshes[ i ].material.color.setHex( grid1Colors[ i ] );
        grid2Meshes[ i ].material.color.setHex( grid2Colors[ i ] );
    }
    
    canPerformBenchMark = true;
}


function LoadKernels()
{
    webCLGL  = new WebCLGL();
    
    var client = new XMLHttpRequest();
    
    client.open( 'GET', './setColor.txt', false );
    client.onreadystatechange = function()
    {     
        if( client.readyState === 4 )
        {
            if( client.status === 200 || client.status == 0 )
            {
                var source = client.responseText;
                kernel_setColor1 = webCLGL.createKernel( source );
                kernel_setColor2 = webCLGL.createKernel( source );
            }
        }      
    } 
    
    client.send( null );
}


function Initialize()
{
    seed = Math.round( Math.random() * 256 );
    LoadKernels();
}


var onKeyDown = function( eventArgs )
{
    if ( canPerformBenchMark ) 
    {
        if ( ( String.fromCharCode( eventArgs.keyCode ) === 'C' ) )
        {
            CPU_Benchmark();
        }
        else if ( String.fromCharCode( eventArgs.keyCode ) === 'G' )
        {
            GPU_Benchmark();
        }
    }
}

var onKeyUp = function( eventArgs )
{

}

Initialize();

document.addEventListener( "keydown", onKeyDown );
document.addEventListener( "keyup", onKeyUp )