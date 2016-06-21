'use strict';
const TimeSession = require('../aggregate');
const { EVT_CLOCKED_IN } = require('./names');

//Exports
module.exports = clockedInEventBuilder;

function* clockedInEventBuilder(timeSessions, data) {
	let timeSession;

	try {
		timeSession = yield TimeSession.open(data);
	} catch(err) {
		throw err;
	}

	return {
		type: EVT_CLOCKED_IN,
		data: timeSession
	};
}