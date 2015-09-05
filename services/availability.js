/*
 *  Service that manages user availability
 *  Set and get user availability on certain dates / date ranges
 *
 */

var Availability = require('../schemas/availability.js');

/**
* Set the availability for a user
* @param user {String} username to set the availability for
* @param date {Date} date for which the availability will be set
* @param part {String} morning, afternoon, evening, allday
* @param available {Boolean} availability of the user
**/
function setAvailability(user, date, part, available)
{
	part = part.toLowerCase();

	Availability.findOrCreate(
  {
    user: user,
    date: date
  },
	{},
  function(err, availability, created)
  {
      if(part === 'allday')
			{
				availability.part.morning = available;
				availability.part.afternoon = available;
				availability.part.evening = available;
			} else {
				availability.part[part] = available;
			}
      availability.save(function(err)
      {
        if(err) { console.log('Error saving availability to the database', user.name); }
      });
  });
}
// TODO: function getDate(date,  [user]) - User optional, no user = combine all data



// TODO: function setRange(date, user)

// TODO: function getRange(fromDate, toDate, [user]) - User optional, no user = combine all data

module.exports.setAvailability = setAvailability;
