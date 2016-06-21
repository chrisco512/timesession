'use strict';
const _ = require('underscore');
const uuid = require('node-uuid');
const {
	ERR_TIME_SESSION_USERID_NOT_FOUND,
	ERR_TIME_SESSION_CLOCKEDOUT_TIME_INVALID,
	ERR_TIME_SESSION_CLOCKEDIN_TIME_INVALID
} = require('./errors');

module.exports = {
	open,
	close,
	adjClockedIn,
	adjClockedOut,
	findById
};

function open(data) {
	return new Promise((resolve, reject) => {
		let _id = data._id || uuid.v4();
		let clockedIn = data.clockedIn || (new Date()).toUTCString();
		let { userId } = data;

		//rudimentary validation
		if(!userId) {
			reject({ userId: ERR_TIME_SESSION_USERID_NOT_FOUND });
		}

		resolve({ _id, userId, clockedIn });
	});
}

function close(timeSession, data) {
	return new Promise((resolve, reject) => {
		let clockedOut = data.clockedOut || (new Date()).toUTCString();
		timeSession = _.extend({}, timeSession, { clockedOut });

		if(new Date(timeSession.clockedOut) - new Date(timeSession.clockedIn) <= 0) {
			reject({ clockedOut: ERR_TIME_SESSION_CLOCKEDOUT_TIME_INVALID });
		}

		resolve(timeSession);
	});
}

function adjClockedOut(timeSession, data) {
	return new Promise((resolve, reject) => {
		let { clockedOut } = data;
		timeSession = _.extend({}, timeSession, { clockedOut });

		if(new Date(timeSession.clockedOut) - new Date(timeSession.clockedIn) <= 0) {
			reject({ clockedOut: ERR_TIME_SESSION_CLOCKEDOUT_TIME_INVALID });
		}

		resolve(timeSession);
	});
}

function adjClockedIn(timeSession, data) {
	return new Promise((resolve, reject) => {
		let { clockedIn } = data;
		timeSession = _.extend({}, timeSession, { clockedIn });

		if(new Date(timeSession.clockedOut) - new Date(timeSession.clockedIn) <= 0) {
			reject({ clockedIn: ERR_TIME_SESSION_CLOCKEDIN_TIME_INVALID });
		}

		resolve(timeSession);
	});
}

function findById(timeSessions, id) {
	return new Promise((resolve, reject) => {
		let timeSession = _.find(timeSessions, m => m._id === id);
		if(timeSession) {
			resolve(timeSession);
		}
		reject({ _id: ERR_TIME_SESSION_NOT_FOUND });
	});
}