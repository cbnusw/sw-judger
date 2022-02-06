const { promises, existsSync } = require('fs');
const path = require('path');
const { parse } = require('url');

const judger = require('/Judger/bindings/NodeJS');
const base = require('./base.js');
const { Submit, Problem, File } = require('./models/@main');
const { OUTPUT_PATH, CODE_BASE_PATH } = require('./env');
const { execSync } = require("child_process");

const getBasename = url => path.basename(parse(url).pathname);

const startJudge = async (submit) => {

  let config = base.baseconfig();

  config['submit_id'] = submit._Id;

  config['language'] = submit.language;
  config['code_name'] = getBasename(submit.source);
  config['answer_path'] = path.join(CODE_BASE_PATH,getBasename(submit.source));
  let compiledPath
  console.log("컴파일 시작");
  switch (config['language']) {
    case 'c':
      compiledPath = base.compile_c(config['code_name']);
      config['exe_path'] = compiledPath;
      console.log("complied language :::::: C");
      break;
    case 'c++':
      compiledPath = base.compile_cpp(config['code_name'])
      config['exe_path'] = compiledPath;
      console.log("complied language :::::: C++");
      break;
    case 'python2':
      config['exe_path'] = '/usr/bin/python2.7';
      compiledPath = config['exe_path'];
      config['args'] = `${path.join(base.code_base_path, config['code_name'])}`.split(' ');
      console.log("complied language :::::: Python2");
      break;
    case 'python3':
      config['exe_path'] = '/usr/local/bin/python3.9';
      compiledPath = config['exe_path'];
      config['args'] = `${path.join(base.code_base_path, config['code_name'])}`.split(' ');
      console.log("complied language :::::: Python3");
      break;
    case 'java':
      const originalJava = await File.findOne({url:submit.source});
      compiledPath = base.compile_java(config['code_name'], originalJava.filename);
      config['exe_path'] = '/usr/bin/java';
      config['args'] = `-cp /java_submit ${originalJava.filename.substring(0, originalJava.filename.lastIndexOf("."))}`.split(' ');
      config['memory_limit_check_only'] = 1;
      config['java_result_path'] = compiledPath;
      console.log("complied language :::::: Java");
      break;
    case 'kotlin':
      const originalKotlin = await File.findOne({url:submit.source});
      compiledPath = base.compile_kotlin(config['code_name'], originalKotlin.filename);
      config['exe_path'] = '/kotlin/bin/kotlin';
      config['args'] = `/kotlin_submit/${originalKotlin.filename.substring(0, originalKotlin.filename.lastIndexOf("."))+'.jar'}`.split(' ');
      config['memory_limit_check_only'] = 1;
      config['kotlin_result_path'] = compiledPath;
      console.log("complied language :::::: Kotlin");
      break;
    case 'go':
      compiledPath = base.compile_go(config['code_name']);
      config['exe_path'] = compiledPath;
      config['memory_limit_check_only'] = 1;
      console.log("complied language :::::: Go");
      break;
  }
  console.log("컴파일 완료");
  // console.log(config)
  if (!existsSync(compiledPath)) {
    await submit.updateOne({
      $set: {
        result: {
          type: 'compile',
          memory: 0,
          time: 0
        }
      }
    });
    return {};
  }

  console.log("채점 시작");
  const result = await judge(config, submit)
  console.log("채점 완료");

  const type = ['done', 'timeout', 'timeout', 'memory', 'runtime', 'wrong'];

  if (result['type'] == judger.RESULT_WRONG_ANSWER)
    result['type'] = 5;

  await submit.updateOne({
    $set: {
      result: {
        type: type[result['type']],
        memory: result['memory'],
        time: result['real_time']
      }
    }
  });
  console.log("삭제 시작");

  let resultPath
  let language = config['language']
  if (language === 'java')
  { resultPath = config['java_result_path'];
    execSync('rm -rf /java_submit/*')
  }
  else if (language === 'kotlin')
  { resultPath = config['kotlin_result_path'];
    execSync('rm -rf /kotlin_submit/*')}
  else
    resultPath = path.join(OUTPUT_PATH, `${config['submit_id']}.out`);

  try {
    await promises.unlink(resultPath);
    if (language === 'c' || language === 'c++' || language === 'go') {
      await  promises.unlink(config['exe_path']);
    }
  } catch (e) {
    console.log(`Deletion Error : File Not Found In Path "${resultPath}"`);
  }
  console.log("삭제 완료");
  return result;
}

const judge = async (config, submit) => {
  // console.log(submit)
  const problem = await Problem.findById({ _id: submit.problem })
    .populate({ path: 'ioSet.inFile' })
    .populate({ path: 'ioSet.outFile' });

  config["max_real_time"] = problem.options.maxRealTime;

  if (config['language'] == "python")
    config["max_cpu_time"] = config["max_cpu_time"] * 10;

  config["max_memory"] = problem.options.maxMemory * 1024 * 1024;

  console.log("real", config["max_real_time"]);
  console.log("memory", config["max_memory"]);

  const { ioSet } = problem;

  let result = { 'memory': 0, 'real_time': 0 };

  for (const io of ioSet) {
    config['input_path'] = path.join(OUTPUT_PATH, getBasename(io.inFile.url));
    config['answer_path'] = path.join(OUTPUT_PATH, getBasename(io.outFile.url));
    config['output_path'] = path.join(OUTPUT_PATH, `${config['submit_id']}.out`);

    // console.log(config);
    const judgerResult = await judger.run(config);

    const answer = base.read_file(config['answer_path']).replace(/(^\s*)|(\s*$)/g, "");
    const output = base.read_file(config['output_path']).replace(/(^\s*)|(\s*$)/g, "");
    result['type'] = judgerResult['result'];
    result['memory'] = judgerResult['memory'];
    result['real_time'] = judgerResult['real_time'];

    // console.log(judgerResult);
    if (judgerResult['result'] != judger.RESULT_SUCCESS)
    {
      console.log("result undefined");
      break;
    }

    if (answer != output) {
      result['type'] = judger.RESULT_WRONG_ANSWER;
      console.log("wrong answer!")
      break;
    }
  }

  return result;
}

module.exports = {
  startJudge
};
