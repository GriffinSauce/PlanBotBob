/*
 *  Service that manages user availability
 *  Set and get user availability on certain dates / date ranges
 *
 */

var Availability = require('./schemas/availability.js');
function setAvailability(user, date, part, available)
{
	Availability.findOrCreate(
  {
    user: user,
    date: date
  },
	{},
  function(err, availability, created)
  {
      if(part === null || part === undefined)
			{
				availability.part.morning = available;
				availability.part.afternoon = available;
				availability.part.evening = available;
			} else {
				availability[part] = available;
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
