const ffmpeg = require("./ffmpeg-wrapper.js");
ffmpeg.setPath("C:\\Program Files (x86)\\ffmpeg\\bin\\ffmpeg.exe"); // For windows

/*
let param_easy = {
  fps: 30,
  threads: 2,
  input: "input-img-%d.jpg",
  output: "output.mp4",
};
ffmpeg.runEasy(param_easy, working, end);
*/

/*
let param_merge = {
  fps: 30,
  threads: 2,
  delay: 10, // delay between img in sec
  inputPath: "/home/toto/my_img_foolder",
  input: ["1.jpg", "5.jpg", "3.jpg", "1.jpg", "2.jpg"],
  output: "output.mp4",
  outputRatio: "1280:720",
};
ffmpeg.mergeImg(param_merge, working, end);
*/

/*
let cmd = "-r 30 -threads 2 -i input-img-%d.jpg output.mp4";
ffmpeg.run(cmd, working, end);
*/

function working(frames) {
  console.log("Still working.. Frame: " + frames);
}

function end(data) {
  console.log("End");
}
