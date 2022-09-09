import ffmpeg from "./ffmpeg.mjs";

export default function renderVideo(getFrame, options = {}) {
  return new Promise(async (resolve, reject) => {
    let framesCount;
    let frameIndex = 0;

    const chunks = [];
    const fps = 25;

    const encoder = new VideoEncoder({
      async output(chunk) {
        chunks.push(chunk);

        if (chunks.length !== framesCount) return;

        await renderMP4();
      },
      error(error) {
        console.log(error.message);
      },
    });

    async function renderMP4() {
      const buffers = chunks.map(chunk => {
        const buffer = new ArrayBuffer(chunk.byteLength);
        chunk.copyTo(buffer);
        return buffer;
      });

      const byteLength = buffers.reduce((length, buffer) => length + buffer.byteLength, 0);
      const u8Array = new Uint8Array(byteLength);

      let offset = 0;
      for (const buffer of buffers) {
        u8Array.set(new Uint8Array(buffer), offset);
        offset += buffer.byteLength;
      }

      const inputs = [{ name: "out.h264", data: u8Array }];
      const inputArgs = inputs.map(input => "-i " + input.name).join(" ");

      const mp4Buffer = (
        await ffmpeg({
          MEMFS: inputs,
          arguments: `${inputArgs} -c:v copy -movflags faststart out.mp4`.split(/\s+/),
        })
      ).MEMFS[0].data;

      const mp4Blob = new Blob([mp4Buffer], { type: "video/mp4" });

      resolve(mp4Blob);
    }

    while (true) {
      const frame = await getFrame(frameIndex++);

      if (!frame) {
        framesCount = frameIndex - 1;

        if (encoder.encodeQueueSize === 0) await renderMP4();

        encoder.flush();

        break;
      }

      const width = frame.displayWidth || frame.naturalWidth || frame.width;
      const height = frame.displayHeight || frame.naturalHeight || frame.height;

      encoder.configure({
        codec: "avc1.42001E",
        width: width % 2 ? width + 1 : width,
        height: height % 2 ? height + 1 : height,
        hardwareAcceleration: "prefer-software",
        avc: { format: "annexb" },
      });

      const videoFrame = new VideoFrame(frame, { timestamp: (1e6 / fps) * frameIndex });
      encoder.encode(videoFrame);
      videoFrame.close();

      await new Promise(r => setTimeout(r));
    }
  });
}
