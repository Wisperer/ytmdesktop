const settingsProvider = require('../../../../providers/settingsProvider')
const __ = require('../../../../providers/translateProvider')
const adblockProvider = require('../../../../providers/adblockLoadProvider')

//var, because we have to re-assign the variable
var adblockSettings = null

__.loadi18n()

function loadSettings() {
    adblockSettings = settingsProvider.get('adblock-settings')
    document.getElementById(
        'settings-adblock-list'
    ).value = !!adblockSettings.list ? adblockSettings.list.join('\n') : ''
    M.textareaAutoResize(document.getElementById('settings-adblock-list'))
}

function save() {
    adblockSettings = settingsProvider.get('adblock-settings')
    var oldList = !!adblockSettings.list ? adblockSettings.list.join('\n') : ''
    if (oldList !== document.getElementById('settings-adblock-list').value) {
        settingsProvider.set('adblock-settings', {
            list: document
                .getElementById('settings-adblock-list')
                .value.split('\n')
                .filter(function (val) {
                    return !!val && typeof val === 'string'
                })
                .map(function (val) {
                    return val.trim()
                }),
        })
        if (settingsProvider.get('settings-adblock')) {
            adblockProvider.stop()
            adblockProvider.start()
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loadSettings()
})

document.getElementById('btn-save').addEventListener('click', function () {
    save()
})
