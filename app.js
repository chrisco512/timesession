'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const koa = require('koa');
const app = module.exports = koa();
const util = require('util');
const route = require('koa-route');
const { list, clockIn, clockOut, adjClockIn, adjClockOut } = require('./routes');
const { pageNotFound, error } = require('./middlewares');
const jsonBody = require('koa-json-body');
const state = require('./state');
const co = require('co');
const { rebuildTimeSessionsFromEvents } = require('./utils');

setupHandlers();
co(rebuildTimeSessionsFromEvents(state));

app.use(jsonBody({ limit: '10kb' }));
app.use(pageNotFound);
app.use(error);
if(process.env.NODE_ENV === 'development') {
	app.use(route.get('/time-sessions', list));
	app.use(route.post('/time-sessions/clock-in', clockIn));
	app.use(route.post('/time-sessions/clock-out', clockOut));
	app.use(route.post('/time-sessions/adj-clock-in', adjClockIn));
	app.use(route.post('/time-sessions/adj-clock-out', adjClockOut));
}

if (!module.parent) app.listen(1985);
console.log('TimeSessionService Started')

function setupHandlers() {
	/* Quit Node Properly with Ctrl+C */
	process.on('SIGINT', function() {
		console.log("Gracefully shutting down from SIGINT (Ctrl+C)");
		process.exit();
	});

	// error handler
	app.on('error', function(err) {
		if (process.env.NODE_ENV != 'test') {
			console.log('sent error %s to the cloud', util.inspect(err));
		}
	});
}