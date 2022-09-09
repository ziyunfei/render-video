# render-video
Convert canvas animation to video in browser using WebCodecs API.

## Basic usage
```javascript
const mp4Blob = await renderVideo(async function(frameIndex) {
  if (frameIndex === canvasPlayer.totalFrames) return;

  await canvasPlayer.seek(frameIndex);

  return canvasPlayer.canvas;
});

download(mp4Blob);
```

## Audio support
```javascript
const mp4Blob = await renderVideo(getFrameCallback, {
  audio: "https://xxx/yyy.mp3"
});
```

## Demos
canvas player [https://ziyunfei.github.io/render-video/demo/canvas player.html](https://ziyunfei.github.io/render-video/demo/canvas%20player.html)

images slideshow [https://ziyunfei.github.io/render-video/demo/images slideshow.html](https://ziyunfei.github.io/render-video/demo/images%20slideshow.html)

git to mp4 [https://ziyunfei.github.io/render-video/demo/gif to mp4.html](https://ziyunfei.github.io/render-video/demo/gif%20to%20mp4.html)

lottie to mp4 [https://ziyunfei.github.io/render-video/demo/lottie to mp4.html](https://ziyunfei.github.io/render-video/demo/lottie%20to%20mp4.html)

## Browser support
Chrome 94+ only.
