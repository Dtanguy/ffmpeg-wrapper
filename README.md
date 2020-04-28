# ffmpegWrapper

Wrapper for somes ffmpeg function in node.

## Install

```node
npm i "git+https://github.com/Dtanguy/ffmpegWrapper.git" --save 
```

## Configure

Import:

```node
const ffmpeg = require("ffmpegWrapper");
```

Set ffmpeg path:

```node
ffmpeg.setPath("my_path_to_ffmpeg");
```

## Use

Generate timelapse from sorted images:

```node
let param_easy = {
  fps: 30,
  threads: 2,
  input: "input-img-%d.jpg",
  output: "output.mp4",
};
ffmpeg.runEasy(param_easy, working, end, 1);
```

Generate timelapse from images array:

```node
let param_merge = {
  fps: 30,
  threads: 2,
  delay: 10, // delay between img in sec
  inputPath: "/home/toto/my_img_foolder",
  input: ["1.jpg", "5.jpg", "3.jpg", "1.jpg", "2.jpg"],
  output: "output.mp4",
  outputRatio: "1280:720",
};
ffmpeg.mergeImg(param_merge, working, end, 2);
```

Start stream:

```node
//{"url": "http://my_url:8081/toto/1280/720/", "ratio": "1280x720"}
 let paramStream = {	
  fps: 30,
  threads: 2,
  input: "/dev/video0",
  output: "http://my_url",
  outputRatio: "1280:720",
  port: 8081,
  streamSecret: 'toto'
};
ffmpeg.runStream(paramStream, working, end, 3);
```

Raw cmd:

```node
let cmd = "-r 30 -threads 2 -i input-img-%d.jpg output.mp4";
ffmpeg.run(cmd, working, end, 4);
```

Callback:

```node
function working(frames, jobid) {
  console.log("Job n°" + jobid + " Frame: " + frames);
}

function end(data, jobid) {
  console.log("End Job n°" + jobid);
}
```



