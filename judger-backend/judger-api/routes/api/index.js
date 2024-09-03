const { Router } = require('express');
const { readdirSync, statSync } = require('fs');
const { join } = require('path');
const { API_VERSIONS } = require('../../env');
const { debug } = require('../../utils/logger');

const versions = (API_VERSIONS || 'v1').split(',');

const router = Router();

versions.forEach(v => {
  const r = Router();
  const apiVPath = join(__dirname, v);

  readdirSync(apiVPath)
    .filter(dir => statSync(join(apiVPath, dir)).isDirectory())
    .forEach(dir => {
      debug(`Loading: ${dir} API`);
      try {
        r.use(`/${dir}`, require(join(apiVPath, dir)));
      } catch (error) {
        debug(`Error loading ${dir} API: ${error.message}`);
      }
    });

  router.use(`/${v}`, r);
});

module.exports = router;
