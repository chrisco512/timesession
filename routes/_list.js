'use strict';
const state = require('../state');

function* list() {
	this.response.status = 200;
	this.body = state.timeSessions;
}

module.exports = list;