const fs = require("fs");
const path = require("path");
const execSync = require("child_process").execSync;

const { CODE_BASE_PATH } = require("./env");

const compile_c = function (name, submitId) {
  let rootSubmitId = '/' + submitId
  out_path = path.join(rootSubmitId, name.substring(0, name.lastIndexOf(".")));
  try {
    execSync(`mkdir ${rootSubmitId} && gcc -o ${out_path} ${path.join(CODE_BASE_PATH, name)}`);
  } catch (err) {
    console.log(err);
    out_path = 'null'
  }
  return out_path;
};

const compile_cpp = function (name, submitId) {
  let rootSubmitId = '/' + submitId
  out_path = path.join(rootSubmitId, name.substring(0, name.lastIndexOf(".")));
  try {
    execSync(`mkdir ${rootSubmitId} && g++ -o ${out_path} ${path.join(CODE_BASE_PATH, name)}`);
  }
  catch (err) {
    console.log(err);
    out_path = 'null'
  }
  return out_path;
};

const compile_java = function (name, originalName, submitId) {
  let rootSubmitId = "/" + submitId;
  try {
    execSync(
      `mkdir ${rootSubmitId} && cp ${path.join(
        CODE_BASE_PATH,
        name
      )} ${path.join(rootSubmitId, originalName)} &&javac ${path.join(
        rootSubmitId,
        originalName
      )} -encoding UTF8 &&rm -rf ${path.join(rootSubmitId, originalName)}`
    );
    out_path = path.join(
      rootSubmitId,
      originalName.substring(0, originalName.lastIndexOf(".")) + ".class"
    );
  } catch (err) {
    console.log(err);
    out_path = "null";
  }
  return out_path;
};

const compile_kotlin = function (name, originalName, submitId) {
  let rootSubmitId = "/" + submitId;
  try {
    execSync(
      `mkdir ${rootSubmitId} && cp ${path.join(
        CODE_BASE_PATH,
        name
      )} ${path.join(
        rootSubmitId,
        originalName
      )} && /kotlin/bin/kotlinc-jvm ${path.join(
        rootSubmitId,
        originalName
      )} -include-runtime -d ${path.join(
        rootSubmitId,
        originalName.substring(0, originalName.lastIndexOf(".")) + ".jar"
      )}&& rm -rf ${path.join(rootSubmitId, originalName)}`
    );
    out_path = path.join(
      rootSubmitId,
      originalName.substring(0, originalName.lastIndexOf(".")) + ".jar"
    );
  } catch (err) {
    console.log(err);
    out_path = "null";
  }
  return out_path;
};

const compile_go = function (name, submitId) {
  let rootSubmitId = "/" + submitId;
  out_path = path.join(rootSubmitId, name.substring(0, name.lastIndexOf(".")));
  try {
    execSync(
      `mkdir ${rootSubmitId} && go build -o ${out_path} ${path.join(
        CODE_BASE_PATH,
        name
      )}`
    );
  } catch (err) {
    console.log(err);
    out_path = "null";
  }
  return out_path;
};

const read_file = (read_path) => {
  return fs.readFileSync(read_path, { encoding: "utf-8" });
};

const mkdir = (_path) => {
  execSync(`mkdir -p ${_path}`);
};

const rmdir = (_path) => {
  execSync(`rm -r ${_path}`);
};

const baseconfig = () => {
  return {
    max_cpu_time: 1000,
    max_real_time: 8000,
    max_memory: 128 * 1024 * 1024,
    max_stack: 128 * 1024 * 1024,
    max_process_number: 8,
    max_output_size: 128 * 1024 * 1024,
    exe_path: "/dev/null",
    input_path: "/dev/null",
    output_path: "/dev/null",
    error_path: "/dev/null",
    args: [],
    env: [],
    log_path: "/dev/null",
    seccomp_rule_name: null,
    gid: 0,
    uid: 0,
    info: false,
    debug: false,
  };
};

module.exports = {
  compile_c,
  compile_cpp,
  compile_java,
  compile_kotlin,
  compile_go,
  read_file,
  mkdir,
  rmdir,
  baseconfig,
  code_base_path: CODE_BASE_PATH,
};
