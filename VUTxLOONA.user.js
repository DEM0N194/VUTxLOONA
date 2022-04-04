// ==UserScript==
// @name         VUTxLOONA
// @namespace    https://github.com/DEM0N194/VUTxLOONA
// @version      1.2.3
// @description  r/place template script for VUT.CZ and r/LOONA
// @author       u/DEM0N194
// @match        https://www.reddit.com/r/place/*
// @match        https://new.reddit.com/r/place/*
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://raw.githubusercontent.com/DEM0N194/VUTxLOONA/main/vutez.png
// @grant        none
// @downloadURL  https://github.com/DEM0N194/VUTxLOONA/raw/main/VUTxLOONA.user.js
// @license      GPL-3.0
// ==/UserScript==

const images = [
  /* for the image location, some hosts will not work as they do not sent the appropriate CORS HTTP header,
   *  if your image does not work use a differnet host, imgur works */
  /* scale specifies how large one pixel is in a source image, if the image size is 640x640 and it represents a
   * 64x64 pixel image, scale is 10 */
  
  /* [x_location, y_location, scale, image_url] */
  [1330, 570, 1, "https://raw.githubusercontent.com/DEM0N194/VUTxLOONA/main/vutez.png"],
  [1290, 580, 1, "https://raw.githubusercontent.com/DEM0N194/VUTxLOONA/main/hyunjin2.png"],
  [302, 780, 1, "https://raw.githubusercontent.com/DEM0N194/VUTxLOONA/main/LOONAxVUT.CZ.png"],
  [1362, 570, 1, "https://raw.githubusercontent.com/DEM0N194/VUTxLOONA/main/sapari_cardiacs.png"],
  [352, 1600, 1, "https://raw.githubusercontent.com/DEM0N194/VUTxLOONA/main/TrojanChuu2.png"],
  [1902,994, 1, "https://raw.githubusercontent.com/DEM0N194/VUTxLOONA/main/yinyang_noborder3.png"],
  [1670, 1585, 1, "https://raw.githubusercontent.com/DEM0N194/VUTxLOONA/main/ot12.png"],
  [1900, 1022, 1, "https://raw.githubusercontent.com/DEM0N194/VUTxLOONA/main/fitvut.png"],
  [511, 529, 1, "https://raw.githubusercontent.com/DEM0N194/VUTxLOONA/main/miniloona-black-bg-511-529icon.png"],
  [1633, 892, 1, "https://raw.githubusercontent.com/DEM0N194/VUTxLOONA/main/rloona-at-1633-892.png"],
]


const pixels_per_placepixel = 3; // how wide is one r/place pixel, we insert the template pixel into the middle pixel of a "r/place pixel"


function get_pix(imgdata, x, y, scale, width){
  // we want to sample in the middle of the pixel
  x = parseInt(scale/2) + x*scale;
  y = parseInt(scale/2) + y*scale;

  const px = x*4 + y *(width*scale * 4);
  
  const r = imgdata[px  ];
  const g = imgdata[px+1];
  const b = imgdata[px+2];
  const a = imgdata[px+3];
 
  return [r, g, b, a];
}

function set_pix(imgdata, x, y, scale, width, rgba){
  // we want to set in the middle of the pixel
  x = parseInt(scale/2) + x*scale;
  y = parseInt(scale/2) + y*scale;
  
  const px = x*4 + y *(width*scale * 4);
 
  imgdata[px  ] = rgba[0];
  imgdata[px+1] = rgba[1];
  imgdata[px+2] = rgba[2];
  imgdata[px+3] = rgba[3];
}

function imgload(img, x, y, scale){
  const img_canvas = document.createElement("canvas");
  const img_w = img.width; 
  const img_h = img.height; 
  
  img_canvas.width  = img_w;
  img_canvas.height = img_h;
  
  const img_ctx = img_canvas.getContext('2d');
  img_ctx.drawImage(img, 0, 0);  
  
  const canvas = document.createElement("canvas");
  canvas.id = "template";
  canvas.width  = (img_w / scale) * pixels_per_placepixel;
  canvas.height = (img_h / scale) * pixels_per_placepixel;
  
  
  canvas.style = "position: absolute;left:" + (x-0.25) + "px ;top:" + (y-0.5) + "px;image-rendering: pixelated;" + "width: " + parseInt(img_w / scale)  + "px;height: " + parseInt(img_h / scale) + "px;";
  
  console.log(canvas);
  const ctx = canvas.getContext('2d');
  
  const src = img_ctx.getImageData(0, 0, img_w, img_h);
  const dest = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  let width  = parseInt(img.width / scale);
  let height = parseInt(img.height/ scale);
  //width = 10;
  //height = 10;

  for (let j=0; j < height; j+=1){
    for (let i=0; i < width; i+=1){
      const rgba = get_pix(src.data, i, j, scale, width);
      set_pix(dest.data, i, j, pixels_per_placepixel, width, rgba);    
    }   
  }
  
  console.log(dest);
  
  ctx.putImageData(dest, 0, 0);
  console.log(ctx);

	document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0]
    .getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0]
    .appendChild(canvas);
}

function windowload(){
  for (const image of images){
    const img = new Image();
    img.crossOrigin = 'anonymous';
  
    img.addEventListener('load', function() {
      imgload(img, image[0], image[1], image[2])
    }, false);
  
    img.src = image[3];
  }
}


if (window.top !== window.self) {
  window.addEventListener('load', windowload, false);
}