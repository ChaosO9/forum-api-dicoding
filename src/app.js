require('dotenv').config();
const createServer = require('./Infrastructures/http/createServer');
const container = require('./Infrastructures/container');

(async () => {
  try {
    const server = await createServer(container);
    await server.start();
    // eslint-disable-next-line no-console
    console.log(`server start at ${server.info.uri}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
