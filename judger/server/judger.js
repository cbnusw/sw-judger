const { promises, fstat, existsSync } = require('fs');
const path = require('path');
const { parse } = require('url');

const judger = require('/Judger/bindings/NodeJS');
const base = require('./base.js');
const { Submit, Problem } = require('./models/@main');
const { OUTPUT_PATH, CODE_BASE_PATH } = require('./env');

const getBasename = url => path.basename(parse(url).pathname);

const startJudge = async (submitId) => {
  let config = base.baseconfig();

  config['submit_id'] = submitId;
  const submit = await Submit.findById(submitId)

  if (!submit)
    return;

  config['language'] = submit.language;
  config['code_name'] = path.join(CODE_BASE_PATH, getBasename(submit.source));

  let compiledPath;
  console.log("컴파일 시작");
  switch (config['language']) {
    case 'c':
      compiledPath = base.compile_c(config['code_name']);
      config['exe_path'] = compiledPath;
      break;
    case 'c++':
      compiledPath = base.compile_cpp(config['code_name'])
      config['exe_path'] = compiledPath;
      break;
    case 'python2':
      config['exe_path'] = '/usr/bin/python';
      config['args'] = [path.join(base.code_base_path, config['code_name'])];
      break;
    case 'python3':
      config['exe_path'] = '/usr/bin/python3';
      config['args'] = [path.join(base.code_base_path, config['code_name'])];
      break;
    case 'java':
      compiledPath = base.compile_java(config['code_name']);
      config['exe_path'] = '/usr/bin/java';
      config['args'] = `-cp ${base.code_base_path} -Djava.security.manager -Dfile.encoding=UTF-8 -Djava.security.policy==/etc/java_policy -Djava.awt.headless=true ${compiledPath}`.split(' ');
      config['memory_limit_check_only'] = 1;
      break;
    case 'kotlin':
      compiledPath = base.compile_kotlin(config['code_name']);
      config['exe_path'] = '/usr/bin/java';
      config['args'] = `-cp ${base.code_base_path} -Djava.security.manager -Dfile.encoding=UTF-8 -Djava.security.policy==/etc/java_policy -Djava.awt.headless=true ${compiledPath}`.split(' ');
      config['memory_limit_check_only'] = 1;
      break;
    case 'go':
      compiledPath = base.compile_go(config['code_name']);
      config['exe_path'] = compiledPath;
      config['memory_limit_check_only'] = 1;
      break;
  }
  console.log("컴파일 완료");

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
  const result = await judge(config);
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

  const resultPath = path.join(OUTPUT_PATH, `${config['submit_id']}.out`);

  console.log("삭제 시작");
  try {
    await promises.unlink(resultPath);
    if (compiledPath) {
      await promises.unlink(compiledPath);
    }
  } catch (e) {
    console.error(e);
  }
  console.log("삭제 완료");
  return result;
}

const judge = async (config) => {
  const problem = await Problem.findById(submit.problem)
    .populate({ path: 'ioSet.inFile' })
    .populate({ path: 'ioSet.outFile' });

  config["max_real_time"] = problem.options.maxRealTime;
  config["max_memory"] = problem.options.maxMemory * 1024 * 1024;

  console.log("real", config["max_real_time"]);
  console.log("memory", config["max_memory"]);

  const { ioSet } = problem;

  let result = { 'memory': 0, 'real_time': 0 };

  for (const io of ioSet) {
    config['input_path'] = path.join('/io', getBasename(io.inFile.url)); // todo 연결된 볼륨 주소로 치환
    config['answer_path'] = path.join('/io', getBasename(io.outFile.url)); // todo 연결된 볼륨 주소로 치환
    config['output_path'] = path.join(OUTPUT_PATH, `${config['submit_id']}.out`);

    console.log(config['input_path']);
    console.log(config['answer_path']);
    console.log(config['output_path']);

    const judgerResult = await judger.run(config);

    const answer = base.read_file(config['answer_path']);
    const output = base.read_file(config['output_path']);

    result['type'] = judgerResult['result'];

    if (result['memory'] > judgerResult['memory'])
      result['memory'] = judgerResult['memory'];

    if (result['real_time'] > judgerResult['real_time'])
      result['real_time'] = judgerResult['real_time'];

    console.log(result['memory'], result['real_time']);

    if (judgerResult['result'] != judger.RESULT_SUCCESS)
      break;

    if (answer !== output) {
      result['type'] = judger.RESULT_WRONG_ANSWER;
      break;
    }
  }

  return result;
}

module.exports = {
  startJudge
};
