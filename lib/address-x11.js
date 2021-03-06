// read dbus adress from window selection

var x11 = require('x11');
var fs = require('fs');
var os = require('os');

function trim(str) {
    return str.split('\n')[0];
}

function getDbusAddress(callback) {
    // read machine uuid
    fs.readFile('/var/lib/dbus/machine-id', 'ascii', function(err, uuid) {
        if (err) return callback(err);
        var hostname = os.hostname().split('-')[0];
        x11.createClient(function(display) {
            var X = display.client;
            var selectionName = '_DBUS_SESSION_BUS_SELECTION_' + hostname + '_' + trim(uuid);
            X.InternAtom(false, selectionName, function(err, id) {
                if (err) return callback(err);
                X.GetSelectionOwner(id, function(err, win) {
                    if (err) return callback(err);
                    X.InternAtom(false, '_DBUS_SESSION_BUS_ADDRESS', function(err, propId) {
                        if (err) return callback(err);
                        X.GetProperty(0, win, propId, 0, 0, 10000000, function(err, val) {
                            if (err) return callback(err);
                            callback(null, val.data.toString());
                        });
                   });
               });
           });
       });
   });
}

module.exports = getDbusAddress;
//getDbusAddress(console.log);
