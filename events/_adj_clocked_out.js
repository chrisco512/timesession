'use strict';
const TimeSession = require('../aggregate');
const { EVT_ADJ_CLOCKED_OUT } = require('./names');

//Exports
module.exports = adjClockedOutEventBuilder;

function* adjClockedOutEventBuilder(timeSessions, data) {
	let timeSession;
	let { _id, adjusterId } = data;

	if(!adjusterId) {
		throw { adjusterId: "Must include user id of adjuster." };
	}

	try {
		timeSession = yield TimeSession.findById(timeSessions, _id);
		timeSession = yield TimeSession.adjClockedOut(timeSession, data);
	} catch(err) {
		throw err;
	}

	let { clockedOut } = timeSession;

	return {
		type: EVT_ADJ_CLOCKED_OUT,
		data: { _id, adjusterId, clockedOut }
	};
}