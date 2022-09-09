# render-video
Convert canvas animation to video in browser using WebCodecs API.

## Basic usage
```
const mp4Blob = await renderVideo(async function(frameIndex) {
  if (frameIndex === canvasPlayer.totalFrames) return;

  await canvasPlayer.seek(frameIndex);

  return canvasPlayer.canvas;
});

download(mp4Blob);
```

## Browser support
Chrome 94+ only.
