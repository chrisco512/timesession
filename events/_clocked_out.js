'use strict';
const TimeSession = require('../aggregate');
const { EVT_CLOCKED_OUT } = require('./names');

//Exports
module.exports = clockedOutEventBuilder;

function* clockedOutEventBuilder(timeSessions, data) {
	let timeSession;
	let { _id } = data;

	try {
		timeSession = yield TimeSession.findById(timeSessions, _id);
		timeSession = yield TimeSession.close(timeSession);
	} catch(err) {
		throw err;
	}

	let { clockedOut } = timeSession;

	return {
		type: EVT_CLOCKED_OUT,
		data: { _id, clockedOut }
	};
}