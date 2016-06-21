'use strict';
const config = require('../config/defaults');
const MongoClient = require('mongodb').MongoClient;
const reduce = require('../reducers');
const { EVT_ADJ_CLOCKED_IN } = require('../events/names');
const Events = require('../events');
const state = require('../state');

function* adjClockIn() {
	//try to build event with payload
	let eventResult;

	//throw 400 if can't create new time session
	try {
		eventResult = yield Events[EVT_ADJ_CLOCKED_IN](state.timeSessions, this.request.body);
	} catch(err) {
		this.response.status = 400;
		this.body = err;
		return;
	}

	//save event with meeting data
	let db, events;
	try {
		let url = config.mongo.uri + '/eventclock-dev';
		db = yield MongoClient.connect(url);
		events = db.collection('events');
		yield events.insertOne(eventResult);
	} catch(err) {
		this.response.status = 500;
		this.body = err;
		return;
	} finally {
		if(db) db.close();
	}

	//TODO: Publish event to bus
	state.timeSessions = yield reduce(state.timeSessions, eventResult);

	this.body = eventResult;
	this.response.status = 201;
}

module.exports = adjClockIn;