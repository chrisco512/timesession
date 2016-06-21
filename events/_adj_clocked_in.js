'use strict';
const TimeSession = require('../aggregate');
const { EVT_ADJ_CLOCKED_IN } = require('./names');

//Exports
module.exports = adjClockedInEventBuilder;

function* adjClockedInEventBuilder(timeSessions, data) {
	let timeSession;
	let { _id, adjusterId } = data;

	if(!adjusterId) {
		throw { adjusterId: "Must include user id of adjuster." };
	}

	try {
		timeSession = yield TimeSession.findById(timeSessions, _id);
		timeSession = yield TimeSession.adjClockedIn(timeSession, data);
	} catch(err) {
		throw err;
	}

	let { clockedIn } = timeSession;

	return {
		type: EVT_ADJ_CLOCKED_IN,
		data: { _id, adjusterId, clockedIn }
	};
}