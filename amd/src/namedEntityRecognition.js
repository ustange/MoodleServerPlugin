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
 * @package    local_eexcess
 * @copyright  EEXCESS project <http://eexcess.eu> <feedback@eexcess.eu>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * A module to query the EEXCESS named entitiy recognition and disambiguation service.
 * 
 * @module c4/namedEntityRecognition
 */

/**
 * Callback for the entitiesAndCategories function
 * @callback namedEntityRecognition~onResponse
 * @param {String} status Indicates the status of the request, either "success" or "error". 
 * @param {Object} data Contains the response data. In the case of an error, it is the error message and in the case of success, it is the response returned from the named entity recognition service. TODO: add link to documentation
 */

define(['jquery'], function($) {
    var endpoint = 'https://eexcess.joanneum.at/eexcess-privacy-proxy-issuer-1.0-SNAPSHOT/issuer/recognizeEntity';
    var xhr;

    return {
        /**
         * Retrieves named entities and associated categories for a set of paragraphs.
         * @param {Array<{id:String,headline:String,content:String}>} paragraphs The paragraphs to annotate.
         * @param {namedEntityRecognition~onResponse} callback Callback function called on success or error.
         */
        entitiesAndCategories: function(paragraphs, callback) {
            if (xhr && xhr.readyState !== 4) {
                xhr.abort();
            }
            xhr = $.ajax({
                url: endpoint,
                data: JSON.stringify({paragraphs: paragraphs}),
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json'
            });
            xhr.done(function(response) {
                if (typeof callback !== 'undefined') {
                    callback({status: 'success', data: response});
                }
            });
            xhr.fail(function(jqXHR, textStatus, errorThrown) {
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
    };
});