module.exports = (name, script, instance, exec_mode) => {
  instance = +(instance || 0);
  exec_mode = exec_mode || undefined;

  return { apps: [{ name, script, instance, exec_mode }] };
};
