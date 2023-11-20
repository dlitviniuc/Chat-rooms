const fabric = require('fabric').fabric;
const width = 256, height = 144;
let canvas = new fabric.Canvas(null, {width: width, height: height});

const createWhiteImg= ()=>{
    let rect = new fabric.Rect({
        left:0,
        top:0,
        fill:'white',
        width:width,
        height:height,
        angle:0
    });
    canvas.add(rect);
    return true;
}

const setImage = ()=>{
    let img = canvas.toDataURL();
    //console.log(img);
    //const data = img.replace(/^data:image\/\w+;base64,/, "");
    //const buf = await Buffer.from(data, "base64");
    //await fs.writeFile("image.png", buf);
    return img;
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
    let rgba = hexToRGBA(element.color);
    console.log(rgba);
    let rect = new fabric.Rect({
        left:element.i,
        top:element.j,
        fill:`rgb(${rgba[0]},${rgba[1]},${rgba[2]})`,
        width:1,
        height:1,
        angle:0
    });
    canvas.add(rect);
    return setImage();
}

module.exports = {
    createWhiteImg,
    setImage,
    putPixel
}