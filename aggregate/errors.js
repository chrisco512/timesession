'use strict';
/* Error Messages */
const ERR_TIME_SESSION_USERID_NOT_FOUND             = "User id must be defined to create a new time session.";
const ERR_TIME_SESSION_CLOCKEDOUT_TIME_INVALID      = "Clocked out time must follow clocked in time.";
const ERR_TIME_SESSION_CLOCKEDIN_TIME_INVALID      = "Clocked in time must precede clocked in time.";
const ERR_TIME_SESSION_NOT_FOUND                         = "A time session with that id does not exist.";

module.exports = {
	ERR_TIME_SESSION_USERID_NOT_FOUND,
	ERR_TIME_SESSION_CLOCKEDOUT_TIME_INVALID,
	ERR_TIME_SESSION_CLOCKEDIN_TIME_INVALID,
	ERR_TIME_SESSION_NOT_FOUND
};