
const fs = require('fs');
const molly = require('molly-js');
const worker = require('worker_threads');

/*-------------------------------------------------------------------------------------------------*/

const PORT = 3000;
process.molly.strict = true;
process.molly.iframe = 'sameorigin';
molly.createHTTPServer((server)=>{},PORT);

/*-------------------------------------------------------------------------------------------------*/

if( !worker.isMainThread ) worker.parentPort.postMessage('done');
