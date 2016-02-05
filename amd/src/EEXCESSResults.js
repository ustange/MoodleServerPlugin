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
 * @copyright  bit media e-solutions GmbH <gerhard.doppler@bitmedia.cc>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define(['jquery', 'local_eexcess/APIconnector', 'local_eexcess/iframes', 'local_eexcess/md5','local_eexcess/paragraphDetection'], function ($, api, iframes, md5,pDet) {
    //TODO
    //create HTML elements to hold realuts
    //render results after query response
   var attoEditor = false;
    function createUserID(clientType, userName) {
        var s = location.host + clientType + userName;
        return md5.getHash(s);
    }
    var interestsText = undefined;
    var userId = undefined;
    var baseUrl = undefined;
    var apiSettings = {};
    var origin = {
            module: "EEXCESS - Moodle Plugin searchBar",
            clientType: "EEXCESS - Moodle Plugin",
            clientVersion: "1.0",
            userID: "undefined"
        };

    //Propreties

    //HTML elements

    var searchBardiv = $('<div class = "search-bar-div">'),
        searchBariframe = $('<iframe>'),
        searchBariframeurl = "",
        searchBarHeight,
        profile = null;

    //Methods
    var m = {
        //PUBLIC METHODS
        init: function (base_url, userid, rec_base_url, interests) { // plugin initializer
            interestsText = interests;
            userId = userid;
            origin.userID = createUserID(origin.clientType, userId);
            api.init({origin:origin});
            baseUrl = rec_base_url;
            searchBariframeurl = "https://cdn.rawgit.com/megamuf/c4-for-moodle-plugin/master/examples/searchBar_Paragraphs/index.html";
            m._bindControls();
            m._createUI();
        },

        //PRIVATE METHODS
        _createUI: function () {
            searchBardiv.appendTo($('body'));
            searchBardiv.append(searchBariframe);
            searchBariframe.attr('src',searchBariframeurl);
            searchBariframe.attr('class','search-bar');
        },
        _bindControls: function () { // self explanatory

            $('body').on('mouseup', function (e) {
                var elm = $(e.target);
                //check if selection event is triggered.
                var isEditor = (elm.parents('.editor_atto_content').length || elm.hasClass('editor_atto_content'));
                var text = m._getSelectionText();
                if (text && text.length > 3 && !isEditor) {
                    m._query(text);
                }
            });

        window.addEventListener('message', function (e) {

                if (e.data.event) {
                    if(e.data.data){
                        e.data.data.origin = origin;
                    }

                    if (e.data.event === 'eexcess.paragraphEnd') {
                        m._query(e.data.text);
                    } else if (e.data.event === 'eexcess.newSelection') {

                    } else if (e.data.event === 'eexcess.queryTriggered') {

                    } else if(e.data.event === 'attoEditorOpened'){
                        //window.console.log('attoEditorOpened');
                        iframes.sendMsgAll({event:'attoEditorOpened',data:""});
                        attoEditor = true;

                    } else if (e.data.event === 'eexcess.error') {
                        //_showError(e.data.data);

                    } else if(e.data.event === 'eexcess.searchBarhei'){
                        //window.console.log('e.data.data',e.data.data);
                        searchBarHeight = e.data.data;
                        if(searchBardiv[0].clientHeight == 600){
                            searchBardiv.css('height','600px');
                            if(attoEditor){iframes.sendMsgAll({event:'attoEditorOpened',data:""});}
                        }
                        else{
                            searchBardiv.css('height',searchBarHeight + 'px');
                            if(attoEditor){iframes.sendMsgAll({event:'attoEditorOpened',data:""});}
                        }

                    } else if(e.data.event === 'eexcess.openResultsBar'){
                        searchBardiv.css('height','600px');

                    } else if(e.data.event === 'eexcess.closeResultsBar'){
                        //window.console.log('height',searchBarHeight);
                        searchBardiv.css('height',searchBarHeight + 'px');

                    } else if(e.data.event === 'dashboardOpened'){
                         //window.console.log('dashboardOpened');
                         if(attoEditor){
                             iframes.sendMsgAll({event:'attoEditorOpened',data:""});
                             iframes.sendMsgAll({
                                event: 'eexcess.newDashboardSettings',
                                settings: {
                                    selectedChart: 'timeline',
                                    hideCollections: false,
                                    showLinkImageButton: true,
                                    showLinkItemButton: true,
                                    showScreenshotButton: true,
                                    origin: origin
                                }
                        });
                         } else {
                             iframes.sendMsgAll({
                                event: 'eexcess.newDashboardSettings',
                                settings: {
                                    selectedChart: 'timeline',
                                    hideCollections: false,
                                    showLinkImageButton: false,
                                    showLinkItemButton: false,
                                    showScreenshotButton: false,
                                    origin: origin
                                }
                        });
                         }

                    } else if(e.data.event === 'facetScapeOpened'){
                        //window.console.log('facetScapeOpened');
                        if(attoEditor){
                            iframes.sendMsgAll({event:'attoEditorOpened',data:""});
                        }

                    } else if(e.data.event === 'searchBarOpened'){
                        iframes.sendMsgAll({event:'interests',data:interestsText});
                        apiSettings.origin = origin;
                        apiSettings.baseUrl = baseUrl;
                        iframes.sendMsgAll({event:'apiSettings',data:apiSettings});

                    } else if (e.data.event === 'eexcess.rating') {
                        //_rating($('.eexcess_raty[data-uri="' + e.data.data.uri + '"]'), e.data.data.uri, e.data.data.score);
                    } else if(e.data.event === 'eexcess.linkItemClicked'){
                        //window.console.log('linkItemClicked received');
                    } else if(e.data.event == 'eexcess.log.itemCitedAsImage'){
                        //window.console.log('eexcess.log.itemCitedAsImage ',e.data.data)
                        api.sendLog(api.logInteractionType.itemCitedAsImage, e.data.data, function(r) { window.console.log(r);});
                    } else if(e.data.event == 'eexcess.log.itemCitedAsText'){
                        //window.console.log('eexcess.log.itemCitedAsText ',e.data.data)
                        api.sendLog(api.logInteractionType.itemCitedAsText, e.data.data, function(r) { window.console.log(r);});
                    } else if(e.data.event == 'eexcess.log.itemCitedAsHyperlink'){
                        //window.console.log('eexcess.log.itemCitedAsHyperlink ',e.data.data)
                        api.sendLog(api.logInteractionType.itemCitedAsHyperlink, e.data.data, function(r) { window.console.log(r);});
                    }
                }
            });
        },
        _query: function (txt) { //query api with currently selected text
            pDet.paragraphToQuery(txt,function(r){
                if(r.query && r.query.contextKeywords.length > 0 ){
                     profile = {
                       contextKeywords: r.query.contextKeywords
                    };
                }else{
                       profile = {
                        contextKeywords: [{
                        text: txt,
                        weight: 1.0
                        }]
                    };
                }

                profile.origin = origin;
                iframes.sendMsgAll({
                    event: 'eexcess.queryTriggered',
                    data: profile
                });

            })
        },
        _getSelectionText: function () { // returns currently selected text
            var text = "";
            if (window.getSelection) {
                text = window.getSelection().toString();
            } else if (document.selection && document.selection.type != "Control") {
                text = document.selection.createRange().text;
            }
            return text;
        },
    };

    return {
        init: m.init
    }
})