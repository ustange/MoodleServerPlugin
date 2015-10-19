// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * @package    local-eexcess
 * @copyright  EEXCESS project <http://eexcess.eu> <feedback@eexcess.eu>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * A module to log interactions from EEXCESS components
 * @module c4/LOGconnector
 */

/**
 * Callback used by query
 * @callback LOGconnector~onResponse
 * @param {String} status Indicates the status of the request, either "success" or "error".
 * @param {Object} data Contains the response data. In the case of an error, it is the error message and in the case of success, it is the response returned from the Privacy Proxy in the format described at {@link https://github.com/EEXCESS/eexcess/wiki/json-exchange-format#response-format}. The profile that lead to this response is included in an additional attribute "profile".
 */


define(['jquery'], function($) {
    var settings = {
        url: 'https://eexcess-dev.joanneum.at/eexcess-privacy-proxy-issuer-1.0-SNAPSHOT/issuer/',
        timeout: 10000,
        suffix_log: 'log/',
        loggingLevel: 0
    };

    return {
        interactionType: {
            moduleOpened: "moduleOpened",
            moduleClosed: "moduleClosed",
            moduleStatisticsCollected: "moduleStatisticsCollected",
            itemOpened: "itemOpened",
            itemClosed: "itemClosed",
            itemCitedAsImage: "itemCitedAsImage",
            itemCitedAsText: "itemCitedAsText",
            itemCitedAsHyperlink: "itemCitedAsHyperlink",
            itemRated: "itemRated"
        },
        /**
         * Initializes the module with parameters other than the defaults.
         * @param {Object} config The configuration to be set. Only the parameters to change need to be specified.
         * @param {String} config.url The url of the endpoint.
         * @param {Integer} config.timeout The timeout of the request in ms.
         * @param {String} config.suffix_log The path to the logging endpoints
         */
        init: function (config) {
            settings = $.extend(settings, config);
        },
        /**
         * Function to send a log event to the logging endpoint
         * @param {String} interactionType The type of interaction to be logged. See `settings` for a list of possible interactions
         * @param {Object} logEntry The entry to be logged. The format is described at {@link https://github.com/EEXCESS/eexcess/wiki/EEXCESS---Logging}
         * @param {LOGconnector~onResponse} callback Callback function called on success or error.
         */
        sendLog: function (interactionType, logEntry, callback) {
            var xhr;
            //if (xhr && xhr.readyState !== 4) {
            //    xhr.abort();
            //}

            xhr = $.ajax({
                url: settings.url + settings.suffix_log + interactionType,
                data: JSON.stringify(logEntry),
                type: 'POST',
                contentType: 'application/json; charset=UTF-8',
                timeout: settings.timeout
            });
            xhr.done(function (response) {
                console.log(response);
                if (typeof callback !== 'undefined') {
                    callback({status: 'success', data: response});
                }
            });
            xhr.fail(function (jqXHR, textStatus, errorThrown) {
                if (textStatus !== 'abort') {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                    if (typeof callback !== 'undefined') {
                        callback({status: 'error', data: textStatus});
                    }
                }
            });
        }
    }
});