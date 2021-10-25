const fs = require("fs");
const path = require("path");
const execSync = require("child_process").execSync;

const { CODE_BASE_PATH } = require("./env");

const compile_c = function (name) {
  out_path = path.join(CODE_BASE_PATH, name.substring(0, name.lastIndexOf(".")));
  execSync(`gcc -o  ${out_path} ${path.join(CODE_BASE_PATH, name)}`);
  return out_path;
};

const compile_cpp = function (name) {
  out_path = path.join(CODE_BASE_PATH, name.substring(0, name.lastIndexOf(".")));
  execSync(`g++ -o  ${out_path} ${path.join(CODE_BASE_PATH, name)}`);
  return out_path;
};

const compile_java = function (name) {
  out_path = name.substring(0, name.lastIndexOf("."));
  execSync(`javac -d ${CODE_BASE_PATH} ${path.join(CODE_BASE_PATH, name)} -encoding UTF8`);
  return out_path;
};

const compile_kotlin = function (name) {
  // out_path = path.join(CODE_BASE_PATH, name.substring(0, name.lastIndexOf(".")));
  // execSync(`/kotlin/bin/kotlinc-native -o ${out_path} -opt ${path.join(CODE_BASE_PATH, name)}`);
  // return `${out_path}.kexe`;
  out_path = name.substring(0, name.lastIndexOf("."));
  execSync(`/kotlin/bin/kotlinc-jvm -include-runtime -d ${CODE_BASE_PATH} ${path.join(CODE_BASE_PATH, name)}`);
  return `${out_path}`;
};

const compile_go = function (name) {
  out_path = path.join(CODE_BASE_PATH, name.substring(0, name.lastIndexOf(".")));
  execSync(`go build -o ${CODE_BASE_PATH} ${path.join(CODE_BASE_PATH, name)}`);
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
