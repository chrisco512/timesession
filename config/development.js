'use strict';

// Development specific configuration
// ==================================
module.exports = {
	// MongoDB connection options
	mongo: {
		uri: 'mongodb://localhost:27017',
	},
	servicebus: {
		uri: 'amqp://localhost:5672'
	}
};
