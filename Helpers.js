function Radians(angle){return angle*(Math.PI/180);}


var shortcutsEnabled = false;
var viewmode = {
    wireframe:false,
    normals:false,
    triangles:false
};
function enableKeyboardControls(){
    //Enables use of keyboard shortcuts
    shortcutsEnabled = true;

    var controlDiv = document.createElement('div');
    controlDiv.innerHTML = 'Controls:<br>w - toggle wireframe<br>t - toggle triangles<br>n - toggle normals';
    controlDiv.setAttribute('style','font-family:Arial,sans-serif;font-size:12px;position:fixed;right:16px;bottom:16px;');
    document.body.appendChild(controlDiv);
}
//Comment the following line to disable these keys
enableKeyboardControls();


document.addEventListener('keydown',function(e){
    if(shortcutsEnabled){
        switch(e.keyCode){
            case 87:
                viewmode.wireframe=!viewmode.wireframe;
                break;
            case 78:
                viewmode.normals=!viewmode.normals;
                break;
            case 87:
                viewmode.triangles=!viewmode.triangles;
                break;
            default:
                break;
        }
    }
});


/**
* Demultiplex a vecN, pushing each component onto the specified array.
* @param {number array}	an array of floats representing vertex locations.
* @param {vecN} the vertex whose component values will be pushed.
* @return {none}
*/
function PushVertex(a, v)
{
	switch (v.length)
	{
		case 2:
			a.push(v[0], v[1]);
			break;

		case 3:
			a.push(v[0], v[1], v[2]);
			break;

		case 4:
			a.push(v[0], v[1], v[2], v[3]);
			break;
	}
}