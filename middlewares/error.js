'use strict';
module.exports = function* error(next) {
	try {
		yield next;
	} catch (err) {
		// some errors will have .status
		// however this is not a guarantee
		this.status = err.status || 500;
		this.type = 'json';

		this.body = {
			message: err.message
		};

		// since we handled this manually we'll
		// want to delegate to the regular app
		// level error handling as well so that
		// centralized still functions correctly.
		this.app.emit('error', err, this);
	}
};