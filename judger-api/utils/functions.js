const difference = (arr1, arr2) => arr1.filter(v => !arr2.includes(v));

exports.difference = difference;
