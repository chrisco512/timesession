'use strict';
const config = require('./config/defaults');
const MongoClient = require('mongodb').MongoClient;
const state = require('./state');
const reduce = require('./reducers');

module.exports = {
	rebuildTimeSessionsFromEvents
};

function* rebuildTimeSessionsFromEvents(state) {
	let url = config.mongo.uri + '/eventclock-dev';
	let db = yield MongoClient.connect(url);
	let eventCursor = db.collection('events').find();

	while(yield eventCursor.hasNext()) {
		try {
			let event = yield eventCursor.next();
			state.timeSessions = yield reduce(state.timeSessions, event);
		} catch(err) {
			throw Error(err);
		}
	}

	eventCursor.close();
	db.close();
}
