#!/bin/node

require('dotenv').config();

const fs = require('fs');
const worker = require('worker_threads');

/*-------------------------------------------------------------------------------------------------*/

const db = new worker.Worker('./module/server/db',{ env: worker.SHARE_ENV });
const http = new worker.Worker('./module/server/http',{ env: worker.SHARE_ENV });

/*-------------------------------------------------------------------------------------------------*/