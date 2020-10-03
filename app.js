const faceDetector = new window.FaceDetector();
const video = document.querySelector('video.webcam');

const canvas = document.querySelector('canvas.video');
const ctx = canvas.getContext('2d');

const faceCanvas = document.querySelector('canvas.face');
const faceCtx = faceCanvas.getContext('2d');

const optionInputs = document.querySelectorAll('.controls input[type=range]');

const options = {
    SIZE: 10,
    SCALE: 1.3
}

function handelOption(event){
    const {value, name} = event.currentTarget;
    options[name] = parseFloat(value);
}

optionInputs.forEach(i => i.addEventListener('input', handelOption));

async function populateVideo(){
    const stream = await navigator.mediaDevices.getUserMedia({
        video : {width: 1280, height: 720}
    })
    video.srcObject = stream;
    await video.play();

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    faceCanvas.width = video.videoWidth;
    faceCanvas.height = video.videoHeight;
}

async function detect(){
    const faces = await faceDetector.detect(video);
    // console.log(faces);
    faces.forEach(censor);
    // faces.forEach(drawFace);
    requestAnimationFrame(detect);
}

function drawFace(face){
    const {width, height, top, left} = face.boundingBox;
    // console.log({width, height, top, left});
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(left, top, width, height);
    ctx.strokeStyle = '#ffc600';
    ctx.lineWidth = 2;
}

function censor({boundingBox: face}){
    faceCtx.imageSmoothingEnabled = false;
    faceCtx.clearRect(0,0, faceCanvas.width, faceCanvas.height);
    faceCtx.drawImage(
        video,
        face.x,
        face.y,
        face.width,
        face.height,
       
        face.x,
        face.y,
        options.SIZE,
        options.SIZE
    );

    const width = face.width * options.SCALE;
    const height = face.height * options.SCALE;
    // draw the image again but scaled up this time
    faceCtx.drawImage(
        faceCanvas,
        face.x,
        face.y,
        options.SIZE,
        options.SIZE,

        face.x - (width - face.width) /2,
        face.y - (height - face.height) / 2,
        width,
        height
    );
};


populateVideo().then(detect);