'use strict';
const { EVT_CLOCKED_IN, EVT_CLOCKED_OUT, EVT_ADJ_CLOCKED_IN, EVT_ADJ_CLOCKED_OUT } = require('./names');

const events = {
	[EVT_CLOCKED_IN]        : require('./_clocked_in'),
	[EVT_CLOCKED_OUT]       : require('./_clocked_out'),
	[EVT_ADJ_CLOCKED_IN]    : require('./_adj_clocked_in'),
	[EVT_ADJ_CLOCKED_OUT]   : require('./_adj_clocked_out'),
};

module.exports = events;