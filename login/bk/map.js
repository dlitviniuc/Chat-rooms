const PNG = require('pngjs2').PNG;
const fs = require('fs');
const Pimage = require('pureimage');
const width = 256, height = 144;
const image = 'image.png';
let buffer = new Uint8ClampedArray(width*height*4);
//let buffer = new Array(width*height*4);

const createWhiteImg= async ()=>{
    if(!fs.existsSync(image)){
        for(var i=0; i<height; i++){
            for(var j=0; j<width; j++){
                var pos = (i*width+j)*4;
                buffer[pos]= 100;
                buffer[pos+1]= 100;
                buffer[pos+2]= 100;
                buffer[pos+3]= 255;
            }
        }
        let image = new PNG({width:width, height:height});
        image.data = Buffer.from(buffer);
        await image.pack().pipe(fs.createWriteStream(image));
    }
    return true;
}

async function updateImage(){
    
}

const setImage = async (change=false)=>{
    let b64 = undefined
    if(!fs.existsSync(image)||change){
        await updateImage();
    }
    let i = fs.readFileSync(image);
    b64 = Buffer.from(i).toString('base64');
    return b64;
}

function hexToRGBA(hex) {
    // remove invalid characters
    hex = hex.replace(/[^0-9a-fA-F]/g, '');

    if (hex.length < 5) { 
        // 3, 4 characters double-up
        hex = hex.split('').map(s => s + s).join('');
    }

    // parse pairs of two
    let rgba = hex.match(/.{1,2}/g).map(s => parseInt(s, 16));

    // alpha code between 0 & 1 / default 1
    rgba[3] = rgba.length > 3 ? parseFloat(rgba[3] / 255).toFixed(2): 1;

    return rgba;
}

const putPixel = (element)=>{
    var pos = (element.i*width+element.j)*4;
    let rgba = hexToRGBA(element.color);
    rgba[3]=Math.round(rgba[3]*255);
    console.log(rgba);
    buffer[pos]= rgba[0];
    buffer[pos+1]= rgba[1];
    buffer[pos+2]= rgba[2];
    buffer[pos+3]= rgba[3];
    return setImage(true);
}

module.exports = {
    createWhiteImg,
    setImage,
    putPixel
}