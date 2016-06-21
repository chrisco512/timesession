'use strict';
const TimeSession = require('../aggregate');
const _ = require('underscore');

const {
	EVT_CLOCKED_IN,
	EVT_CLOCKED_OUT,
	EVT_ADJ_CLOCKED_IN,
	EVT_ADJ_CLOCKED_OUT
} = require('../events/names');

const reduce = {
	[EVT_CLOCKED_IN]        : evtClockedIn,
	[EVT_CLOCKED_OUT]       : evtClockedOut,
	[EVT_ADJ_CLOCKED_IN]    : evtAdjClockedIn,
	[EVT_ADJ_CLOCKED_OUT]   : evtAdjClockedOut
};

module.exports = function* (timeSessions, event) {
	let { type, data } = event;

	if(reduce[type]) {
		return yield reduce[type](timeSessions, data);
	}

	return timeSessions;
};

function* evtClockedIn(timeSessions, data) {
	let timeSession;

	try {
		timeSession = yield TimeSession.open(data);
	} catch (err) {
		return timeSessions;
	}

	return [
		...timeSessions,
		timeSession
	];
}

function* evtClockedOut(timeSessions, data) {
	let { _id } = data;
	let timeSessionIndex = _(timeSessions).findIndex(m => m._id === _id);

	let timeSession;

	try {
		timeSession = yield TimeSession.findById(timeSessions, _id);
		timeSession = yield TimeSession.close(timeSession, data);
	} catch (err) {
		return timeSessions;
	}

	return [
		...timeSessions.slice(0, timeSessionIndex),
		timeSession,
		...timeSessions.slice(timeSessionIndex + 1)
	];
}


function* evtAdjClockedOut(timeSessions, data) {
	let { _id } = data;
	let timeSessionIndex = _(timeSessions).findIndex(m => m._id === _id);

	let timeSession;

	try {
		timeSession = yield TimeSession.findById(timeSessions, _id);
		timeSession = yield TimeSession.adjClockedOut(timeSession, data);
	} catch (err) {
		return timeSessions;
	}

	return [
		...timeSessions.slice(0, timeSessionIndex),
		timeSession,
		...timeSessions.slice(timeSessionIndex + 1)
	];
}


function* evtAdjClockedIn(timeSessions, data) {
	let { _id } = data;
	let timeSessionIndex = _(timeSessions).findIndex(m => m._id === _id);

	let timeSession;

	try {
		timeSession = yield TimeSession.findById(timeSessions, _id);
		timeSession = yield TimeSession.adjClockedIn(timeSession, data);
	} catch (err) {
		return timeSessions;
	}

	return [
		...timeSessions.slice(0, timeSessionIndex),
		timeSession,
		...timeSessions.slice(timeSessionIndex + 1)
	];
}



