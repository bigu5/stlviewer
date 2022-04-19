function find_same_color(){
    var div = document.getElementById('pla_link');
    pla_info = nearestColor(document.getElementById("color").value); 
    //div.innerHTML += "<b> " + pla_info[4] +"</b> <p> " +pla_info[3] +" <a href =\"" + pla_info[1] + "\"> Link </a></p>"  ;
    if( pla_info[1] != "None"){
        div.innerHTML = "<b> " + pla_info[4] +"</b> <p> " +pla_info[3] +" <a href =\"" + pla_info[1] + "\"> Link </a></p>"  ;
    }else{
        div.innerHTML = "<b> " + pla_info[4] +"</b> <p> " +pla_info[3] +" <a href =\"" + pla_info[2] + "\"> Link </a></p>"  ;
    }
}
function get_pla_colors(){
    my_text = loadFile("demofile3.txt");
    my_text = parseCSV(my_text);
    //console.log(my_text);
    return(my_text);
}
function loadFile(filePath) {
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", filePath, false);
  xmlhttp.send();
  if (xmlhttp.status==200) {
    result = xmlhttp.responseText;
  }
  return result;
}
function parseCSV(str) {
    var arr = [];
    var quote = false;
    for (var row = col = c = 0; c < str.length; c++) {
        var cc = str[c], nc = str[c+1];
        arr[row] = arr[row] || [];
        arr[row][col] = arr[row][col] || '';
        
        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }
        if (cc == '"') { quote = !quote; continue; }
        if (cc == ',' && !quote) { ++col; continue; }
        if (cc == '\n' && !quote) { ++row; col = 0; continue; }
        
        arr[row][col] += cc;
    }
    return arr;
}
function hexToRgb(hex) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  //console.log(hex)
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Distance between 2 colors (in RGB)
// https://stackoverflow.com/questions/23990802/find-nearest-color-from-a-colors-list
function distance(a, b) {
    return Math.sqrt(Math.pow(a.r - b.r, 2) + Math.pow(a.g - b.g, 2) + Math.pow(a.b - b.b, 2));
}

// return nearest color from array
function nearestColor(colorHex){
  var lowest = Number.POSITIVE_INFINITY;
  var low_index = 0;
  var tmp;
  let index = 0;
  while(index < baseColors.length){
      tmp = distance(hexToRgb(colorHex), hexToRgb(baseColors[index][0]))
      if (tmp < lowest) {
        lowest = tmp;
        low_index = index;
      };
      
        index = index + 1;
    };
  return baseColors[low_index];
  
}
const baseColors = get_pla_colors()
//console.log(nearestColor("#FFFFFF")); 

function STLViewerEnable(classname, stl_name, col) {
    var models = document.getElementsByClassName(classname);
    for (var i = 0; i < models.length; i++) {
        STLViewer(models[i], stl_name, col);
    }
}

function STLViewer(elem, model, color_hx) {
    /*
    if (!THREE.isWebGLAvailable()) {
        elem.appendChild(THREE.getWebGLErrorMessage());
        return;
    }
    */
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    var camera = new THREE.PerspectiveCamera(70, elem.clientWidth / elem.clientHeight, 1, 1000);
    renderer.setSize(elem.clientWidth, elem.clientHeight);
    elem.appendChild(renderer.domElement);

    window.addEventListener('resize', function () {
        renderer.setSize(elem.clientWidth, elem.clientHeight);
        camera.aspect = elem.clientWidth / elem.clientHeight;
        camera.updateProjectionMatrix();
    }, false);

    var controls = new THREE.ArcballControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.rotateSpeed = 0.05;
    controls.dampingFactor = 0.1;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.autoRotate = false;

    var scene = new THREE.Scene();
    bg_col = new THREE.Color("#6A6060");
    scene.background =  bg_col;
    scene.add(new THREE.HemisphereLight(0xffffff, 0x080820, 1.5));
    const loader = new THREE.TextureLoader();
    bgTexture = loader.load("bong_rip.jpg",
    function ( texture ) {
        var img = texture.image;
        bgWidth= img.width;
        bgHeight = img.height;
    } );
    bgTexture.wrapS = THREE.MirroredRepeatWrapping;
    bgTexture.wrapT = THREE.MirroredRepeatWrapping;
    //scene.background = bgTexture;
    controls.addEventListener( 'change', function () {
	    renderer.render( scene, camera );
    } );
    var slide_geo = "un_cahced_slide.stl";
    (new THREE.STLLoader()).load(slide_geo, function (geometry) {
        var x = document.getElementById("slide").value;
        if(x.indexOf("FDE") != -1){
            var slide_mat = new THREE.MeshPhongMaterial({ color: 0x877348, specular: 100, shininess: 95 });
        }
        if(x.indexOf("BLK")!= -1){
            var slide_mat = new THREE.MeshPhongMaterial({ color: 0x0f0f0f, specular: 100, shininess: 95 });
        }
        if(x.indexOf("SGR")!= -1){
            var slide_mat = new THREE.MeshPhongMaterial({ color: 0x5e5b4a, specular: 100, shininess: 95 });
        }
        if(x.indexOf("GRY")!= -1){
            var slide_mat = new THREE.MeshPhongMaterial({ color: 0x666970, specular: 100, shininess: 95 });
        }
        var slide = new THREE.Mesh(geometry, slide_mat);
        scene.add(slide);
        //slide.position.z += 40;
        //slide.scale.x -= .2;
        slide.rotation.z += 3.14159;
        //rotate to look better
        /*
        slide.rotation.y  -= Math.PI/8;
        slide.rotation.z  -= Math.PI/4;
        slide.rotation.x  -= Math.PI/4;
        */
    });
    var parts_geo = "parts.stl";
    (new THREE.STLLoader()).load(parts_geo, function (geometry) {
        var parts_mat = new THREE.MeshPhongMaterial({ color: 0x171616, specular: 55, shininess: 95 });
        var parts = new THREE.Mesh(geometry, parts_mat);
        scene.add(parts);

        parts.rotation.z += 3.14159;
        //rotate to look better
        /*
        parts.rotation.y  -= Math.PI/8;
        parts.rotation.z  -= Math.PI/4;
        parts.rotation.x  -= Math.PI/4;
        */
   });
    (new THREE.STLLoader()).load(model, function (geometry) {
        var material = new THREE.MeshPhongMaterial({ color: color_hx, specular: 100, shininess: 65 });
        var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        // Compute the middle
        var middle = new THREE.Vector3();
        geometry.computeBoundingBox();
        geometry.boundingBox.getCenter(middle);

        // Center it
        mesh.position.x = -1 * middle.x;
        mesh.position.y = -1 * middle.y;
        mesh.position.z = -1 * middle.z;

        mesh.rotation.z += Math.PI;
        //console.log(model.indexOf("BIGGUS"))
        if(model.indexOf("BIGGUS-DICKUS") != -1){
            mesh.rotation.z += Math.PI/2;
            mesh.position.z += -39;
            mesh.position.x += 17;
            mesh.position.y += -5;

        }
        console.log(model.indexOf("9 "));
        console.log(model);
        if(model.indexOf("9 ") != -1){
            mesh.rotation.z += Math.PI/2;
            console.log(model.indexOf("19 "))
            //mesh.position.z += -39;
            mesh.position.x += 16;
            mesh.position.y += -16;

        }
        if(model.indexOf("glong19") != -1){
            //pass the glong bro
            
            mesh.rotation.y -= Math.PI/2;
            mesh.rotation.x -= Math.PI/2;
            console.log(model.indexOf("19 "))
            mesh.position.z += -30;
            mesh.position.x += 6;
            mesh.position.y += 22;
            scene.background = bgTexture;

        }
        //rotate to look better
        /*
            mesh.rotation.y  -= Math.PI/8;
            mesh.rotation.z  -= Math.PI/4;
            
            mesh.rotation.x  -= Math.PI/4;
        */        // Pull the camera away as needed
        var largestDimension = Math.max(geometry.boundingBox.max.x,
            geometry.boundingBox.max.y, geometry.boundingBox.max.z)
        camera.position.z = largestDimension * 3.3;

        //camera.position.y = largestDimension * 1;

        var animate = function () {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }; animate();

    });
}
