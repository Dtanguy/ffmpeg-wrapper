const cp = require("child_process");
const fs = require("fs");
var ffmpeg_path = "ffmpeg";
var ffmpeg_debug = false;

function setPath(path) {
  ffmpeg_path = path;
}

function setDebug() {
  ffmpeg_debug = true;
}
 


function checkParam(paramList, param){
	if(!param){
		console.log("Input error, empty param.");
		return false;
	}	
	for(let i=0; i< paramList.length; i++){
		let tmp = paramList[i];
		if(!param[tmp]){
			console.log("Input error, param not found: " + tmp);
			return false;
		}
	}
	return true;
}


/*
let param_easy = {	
  fps: 30,
  threads: 2,
  input: "/dev/video0",
  output: "http://164.132.56.57",
  outputRatio: "1280:720",
  port: 8081,
  streamSecret = 'toto'
};
*/
function runStream(param, workingCb, endCb, jobid) {
  // Check
  if(!checkParam(['fps', 'threads', 'input', 'output', 'outputRatio', 'port', 'streamSecret'], param)){
	console.err("ffmpeg.runStream: Input error");
	return;
  }
    
  var tmp = param.outputRatio.split(':');
  var tmpurl = param.output + ":" + param.port + "/" + param.streamSecret + "/" + tmp[0] + "/" + tmp[1] + "/";

  let cmd = "";  
  cmd += "-s " + tmp.join('x') + " ";
  cmd += "-f video4linux2" + " "; 
  cmd += "-i " + param.input + " "; 
  cmd += "-f mpegts -codec:v mpeg1video -b 800k"  + " "; 
  cmd += "-r " + param.fps + " ";
  cmd += "-threads " + param.threads + " ";
  cmd += tmpurl;	

  run(cmd, workingCb, endCb, jobid);
}





function stopStream() {
	
}


























// Clean output file (otherwise ffmpeg child process stay stuck)
function rmOutput(path) {
  try {
    if (fs.existsSync(path)) {
      console.warn("Output file already exist, removing..");
      var tempFile = fs.openSync(path, "r");
      fs.closeSync(tempFile);
      fs.unlinkSync(path);
    }
  } catch (err) {
    console.err(err);
  }
}

/*
let param_easy = {
  fps: 30,
  threads: 2,
  input: "input-img-%d.jpg",
  output: "output.mp4",
};
*/
function runEasy(param, workingCb, endCb, jobid) {
  rmOutput(param.output);
  
  // Check
  if(!checkParam(['fps', 'threads', 'input', 'output'], param)){
	console.err("ffmpeg.runEasy: Input error");
	return;
  }
 
  let cmd = "";
  cmd = "-r " + param.fps;
  cmd += " -threads " + param.threads;
  cmd += " -i " + param.input;
  cmd += " " + param.output;
  run(cmd, workingCb, endCb, jobid);
}

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
*/
function mergeImg(param, workingCb, endCb, jobid) {
  rmOutput(param.output);

  // Check
  if(!checkParam(['fps', 'threads', 'input', 'output', 'outputRatio', 'inputPath', 'delay'], param)){
	console.err("ffmpeg.mergeImg: Input error");
	return;
  }
 
  let input = param.input;
  for (i = 0; i < param.input.length; i++) {
    input[i] = '"' + param.inputPath + param.input[i] + '"';
  }
  let output = '"' + param.output + '"';

  let loop = "";
  let filter_complex1 = ' -filter_complex "';
  let filter_complex2 = "";
  for (i = 0; i < input.length; i++) {
    loop += " -loop 1 -framerate 1 -t " + param.delay + " -i " + input[i];
    filter_complex1 +=
      "[" + i + "]scale=" + param.outputRatio + ",setsar=1[#" + i + "]; ";
    filter_complex2 += "[#" + i + "]";
  }
  filter_complex2 += " concat=n=" + input.length + ':v=1:a=0" ';

  let cmd = loop + filter_complex1 + filter_complex2 + output;
  run(cmd, workingCb, endCb, jobid);
}

function run(cmd, workingCb, endCb, jobid) {
  if (!cmd) {
    console.err("ffmpeg.run: Input error");
    return;
  }

  cmd = '"' + ffmpeg_path + '" ' + cmd;
  if(ffmpeg_debug){
    console.log("Start cmd: " + cmd);
  }
  var ffmpeg = cp.exec(cmd);

  ffmpeg.stdout.on("data", function (data) {
    if(ffmpeg_debug){
      console.log(data);
    }  
  });

  ffmpeg.stderr.on("data", function (data) {
    if(ffmpeg_debug){
      console.log(data);
    }    
    let tmp = data.toString().split("frame=")[1];
    if (tmp) {
      tmp = tmp.split("fps=")[0];
      workingCb(parseInt(tmp), jobid);
    }
  });

  ffmpeg.on("exit", function (data) {
    if(ffmpeg_debug){
      console.log(data);
    }  
    endCb(data.toString(), jobid);
  });
}

module.exports.setPath = setPath;
module.exports.setDebug = setDebug;
module.exports.runStream = runStream;
module.exports.stopStream = stopStream;
module.exports.runEasy = runEasy;
module.exports.mergeImg = mergeImg;
module.exports.rmOutput = rmOutput;
module.exports.run = run;
