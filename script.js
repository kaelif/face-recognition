const video = document.getElementById('video')

Promise.all([
    faceapi.nets.tnyFaceDetector.loadFromUri('/face-api.js'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/face-api.js'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/face-api.js'),
    faceapi.nets.faceExpressionNet.loadFromUri('/face-api.js')
]).then(startVideo)

function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

video.addEventListener("play", () => {
    const canvas = faceapi.createCanvasFromMediaFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height:
    video.height }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video,
        new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks
        ().withFaceExpressions()
        const resizedDetections = faceapi.resizeResults(detections,
        displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas, resizedDetections)   
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }, 100)
})