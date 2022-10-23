
const db = require('molly-db');
const fetch = require("molly-fetch");
const worker = require('worker_threads');

/*-------------------------------------------------------------------------------------------------*/


const sdb = new db({ path: process.env.MODEL }).then(()=>{
    fetch('http://localhost:27017/addTable?db=arepatv&table=users');
    fetch('http://localhost:27017/addTable?db=arepatv&table=signup');
    if( !worker.isMainThread ) worker.parentPort.postMessage('done');
}).catch((e)=>{ console.log(e) });

/*-------------------------------------------------------------------------------------------------*/
