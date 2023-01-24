fd.spRendered(function() {

    //disable Conference room field on form load
    fd.field('ConferenceRoom').disabled = !fd.field('ReservationDate').value;

    //set the time interval in minutes
    fd.field('ReservationDate').widgetOptions = {
        interval: 60
    }

    fd.field('ReservationDate').$on('change', function(date) {
        //enable/disable Conference room field if date and time is changed
        fd.field('ConferenceRoom').disabled = !fd.field('ReservationDate').value;

        //clear filtering
        fd.field('ConferenceRoom').filter = '';
        fd.field('ConferenceRoom').refresh();


        if(date != null) {

            var rDate = date.toISOString();

            //replce Room Reservations with the name of the list
            var list = pnp.sp.web.lists.getByTitle("Room Reservations");

            //get IDs of rooms that are occupied
            list.items.filter("ReservationDate eq '" +  rDate +"'").get().then(function(items) {

                //replace ConferenceRoom with the internal name of the lookup field
                roomIds = items.map(function(i) { return i.ConferenceRoomId });

                if(roomIds.length > 0) {

                    //filter Conference room lookup field values
                    var filterString = "Id ne " + roomIds.join(" and Id ne ");
                    fd.field('ConferenceRoom').filter = filterString;
                    fd.field('ConferenceRoom').refresh();
                }
            });
        }
    });
});
