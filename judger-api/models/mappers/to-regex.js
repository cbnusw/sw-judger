module.exports = v => {
  const s = '.*+?^$[]{}()|\\';
  v = v.split('').map(c => s.includes(c) ? '\\' + c : c).join('');
  return { $regex: new RegExp(v, 'i') };
};
