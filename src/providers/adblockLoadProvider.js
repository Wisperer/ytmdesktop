const settingsProvider = require('./settingsProvider')
// Source: https://github.com/cliqz-oss/adblocker/blob/master/packages/adblocker-electron/README.md
const { ElectronBlocker } = require('@cliqz/adblocker-electron')
const fetch = require('cross-fetch') // required 'fetch'
const fs = require('fs').promises // used for caching
const { session } = require('electron')

var blocker
var _isStarted

function isStarted() {
    return _isStarted
}

function _setIsStarted(value) {
    _isStarted = value
}

function start() {
    /*if (!session || session.defaultSession === undefined) {
		//throw new Error('defaultSession is undefined');
		return;
	}*/
    var adblockSettings = settingsProvider.get('adblock-settings')
    if (adblockSettings.list) {
        blocker = ElectronBlocker.fromLists(
            fetch,
            adblockSettings.list,
            {},
            {
                path: 'adblockengine.bin',
                read: fs.readFile,
                write: fs.writeFile,
            }
        ).then((blocker) => {
            blocker.enableBlockingInSession(session.defaultSession)
            _setIsStarted(true)
        })
    }
}

function stop() {
    //if (blocker && blocker.disableBlockingInSession && session && session.defaultSession)
    //	blocker.disableBlockingInSession(session.defaultSession);
    if (blocker && blocker.disableBlockingInSession)
        blocker.disableBlockingInSession(session.defaultSession)
    blocker = null
    fs.unlink('adblockengine.bin', (err) => {
        if (err) {
            console.error(err)
        }
    })
    _setIsStarted(false)
}

module.exports = {
    isStarted: isStarted,
    start: start,
    stop: stop,
}
