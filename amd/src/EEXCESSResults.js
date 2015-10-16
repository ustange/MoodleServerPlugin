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
 * @copyright  bit media e-solutions GmbH <gerhard.doppler@bitmedia.cc>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define(['jquery', 'local_eexcess/APIconnector', 'local_eexcess/iframes', 'local_eexcess/LOGconnector', 'local_eexcess/logging', 'local_eexcess/md5','local_eexcess/paragraphDetection'], function ($, api, iframes, LOGconnector, logging, md5,pDet) {
    //TODO
    //create HTML elements to hold realuts
    //render results after query response

    function createUserID(clientType, userName) {
        return md5.getHash(clientType + userName);
    }
    var queryId = undefined;
    var userId = undefined;
    var loggingSettings = {
        /**
         * The `origin`-object identifies client, module and user. It has to be sent along with each query and log-event.
         */
        origin: {
            /**
             * A client knows its name, version the ID of a user.
             * The client-application itself is called the "root"-module
             */
            clientType: "EEXCESS - Moodle Plugin",
            clientVersion: "2.4",
            module: "eexcess",
            userID: undefined
        },
        /**
         * Can be passed along with queries and detailed queries, to activate/deactivate logging (0=enabled, 1=disabled)
         */
        loggingLevel: 0
    };

    //Propreties

    //HTML elements
    var iframeUrl = "",
        container = $('<div id="eexcess_container" class="eexcess-wrapper"/>'),
        iframe = $('<iframe>'),
        button = $('<div id="eexcess_button" class="sym-eexcess">'),
        resultIndicator = $('<div class="num-result">0</div>'),
        buttonClose = $('<div class = "button-close">'),
        profile = null,
        nextStep = function () {
            var width = 50,
                finalFrame = 3;

            loader.currentFrame = loader.currentFrame < finalFrame ? loader.currentFrame + 1 : 0;
            var bp = width * loader.currentFrame;
            $("#eexcess_button").css('background-position', "-" + bp + "px 0px");

        },
        loader = {
            interval: null,
            currentFrame: 0,
            start: function () {
                if(this.interval){
                    this.stop();
                }
                this.interval = window.setInterval(nextStep, 300);
        },
            stop: function () {
                window.clearInterval(this.interval);
                $("#eexcess_button").css('background-position', "0px 0px");
            }
        };
    //Methods
    var m = {
        //PUBLIC METHODS
        init: function (base_url, userid, rec_base_url) { // plugin initializer
            userId = userid;
            api.init({base_url:rec_base_url});
            loggingSettings.origin.userID = createUserID(loggingSettings.origin.clientType, userId);
            iframeUrl = "https://eexcess.github.io/visualization-widgets/Dashboard/"; //+
            var eventData = {
                    origin: loggingSettings.origin,
                    content: {
                        name: "MoodleEExcess",
                    }
                };
            m._bindControls();
            m._createUI();
        },

        //PRIVATE METHODS
        _createUI: function () {

            container.appendTo($('body'));
            iframe.attr('src', iframeUrl);
            iframe.attr('id', 'moodleEEXCESSdashboard');

            container.append(buttonClose);
            container.append(iframe);
            console.log(iframe);
            iframe.on('message', function(e){
                window.console.log("IFRAME'S message to you!");
                window.console.log(e);
            });
            button.appendTo($('body'));
            button.append(resultIndicator);
            button.css({
                position: 'fixed'
            });
            resultIndicator.hide();
            iframe.on("load", function () {
              window.console.log("onload iframe");
                iframes.sendMsgAll({
                    event: 'eexcess.newDashboardSettings',
                    settings: {
                        selectedChart: 'timeline',
                        hideCollections: false,
                        showLinkImageButton: false,
                        showLinkItemButton: false,
                        showScreenshotButton: false
                    }
                });
            });
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
            })

            buttonClose.on('click', function () {
                button.removeClass('active');
                container.animate({
                    top: '-588px'
                }, 300, function () {
                    container.hide();
                });
            })
            button.on('click', function (e) {
                if (button.hasClass('active')) {
                    button.removeClass('active');
                    container.animate({
                        top: '-588px'
                    }, 300, function () {
                        container.hide();
                    });

                } else {
                    button.addClass('active');
                    container.css({
                        visibility: 'visible'
                    });
                    container.show();
                    container.animate({
                        top: '43px'
                    }, 300);
                }
            });

            window.addEventListener('message', function (e) {
                if(e.data.data){
                    e.data.data.loggingLevel = loggingSettings.loggingLevel;
                    e.data.data.origin = {};
                    e.data.data.origin.clientType = loggingSettings.origin.clientType;
                    e.data.data.origin.clientVersion = loggingSettings.origin.clientVersion;
                    e.data.data.origin.userID = loggingSettings.origin.userID;
                    e.data.data.queryID = queryId;
                }
                if (e.data.event) {

                    if (e.data.event === 'eexcess.paragraphEnd') {
                        m._query(e.data.text);
                    } else if (e.data.event === 'eexcess.newSelection') {

                    } else if (e.data.event === 'eexcess.queryTriggered') {

                    } else if (e.data.event === 'eexcess.error') {
                        //_showError(e.data.data);
                    } else if (e.data.event === 'eexcess.openDashboard') {
                        button.trigger('click');
                    } else if (e.data.event === 'eexcess.newDashboardSettings') {
                        window.console.log(e.data);
                        iframes.sendMsgAll(e.data);
                    }  else if (e.data.event === 'eexcess.rating') {
                        //_rating($('.eexcess_raty[data-uri="' + e.data.data.uri + '"]'), e.data.data.uri, e.data.data.score);
                    } else if (e.data.event === 'eexcess.log.moduleOpened') {
                        window.console.log("module open event");
                    }else if(e.data.event=='eexcess.log.itemCitedAsImage'){
                        LOGconnector.sendLog(LOGconnector.interactionType.itemCitedAsImage, e.data.data, function(r) { window.console.log(r);});
                    }else if(e.data.event=='eexcess.log.itemCitedAsText'){
                        LOGconnector.sendLog(LOGconnector.interactionType.itemCitedAsText, e.data.data, function(r) { window.console.log(r);});
                    }else if(e.data.event=='eexcess.log.itemCitedAsHyperlink'){
                        LOGconnector.sendLog(LOGconnector.interactionType.itemCitedAsHyperlink, e.data.data, function(r) { window.console.log(r);});
                    }else if(e.data.event=='eexcess.log.moduleOpened'){
                        LOGconnector.sendLog(LOGconnector.interactionType.moduleOpened, e.data.data, function(r) { window.console.log(r);});
                    }else if(e.data.event=='eexcess.log.moduleClosed'){
                        LOGconnector.sendLog(LOGconnector.interactionType.moduleClosed, e.data.data, function(r) { window.console.log(r);});
                    }else if(e.data.event=='eexcess.log.moduleStatisticsCollected'){
                        LOGconnector.sendLog(LOGconnector.interactionType.moduleStatisticsCollected, e.data.data, function(r) { window.console.log(r);});
                    }else if(e.data.event=='eexcess.log.itemRated'){
                        LOGconnector.sendLog(LOGconnector.interactionType.itemRated, e.data.data, function(r) { window.console.log(r);});
                    }else if(e.data.event=='eexcess.log.itemOpened'){
                        LOGconnector.sendLog(LOGconnector.interactionType.itemOpened, e.data.data, function(r) { window.console.log(r);});
                    }else if(e.data.event=='eexcess.log.itemClosed'){
                        LOGconnector.sendLog(LOGconnector.interactionType.itemClosed, e.data.data, function(r) { window.console.log(r);});
                    }else{
                        window.console.log("unknown event recieved!");
                        window.console.log(e.data);   
                    }
                }
            });
        },
        _updateResultNumber: function (numRes) {
            if (numRes > 0) {
                resultIndicator.empty().append(numRes);
                resultIndicator.show();
            } else {
                resultIndicator.empty().append(numRes);
                resultIndicator.hide();
            }
        },
        _query: function (txt) { //query api with currently selected text
            var that = this;
            
            that._updateResultNumber(0);
            pDet.paragraphToQuery(txt,function(r){
                window.console.log("pdetect");
                window.console.log(r);
                if(r.query && r.query.contextKeywords.length > 0 ){
                    profile = {
                        numResults: 100,
                        contextKeywords: r.query.contextKeywords
                    };
                }else{
                    profile = {
                        numResults: 100,
                        contextKeywords: [{
                        text: txt,
                        weight: 1.0
                        }]
                    };
                }
                
                iframes.sendMsgAll({
                    event: 'eexcess.queryTriggered',
                    data: profile
                });
                loader.start();
                api.query(profile, function (res) {
                    loader.stop();
                    queryId = res.data.queryID;

                    that._updateResultNumber(res.data.totalResults);
                    if (res.status === 'success') {

                        iframes.sendMsgAll({
                            event: 'eexcess.newResults',
                            data: {
                                profile: profile,
                                result: res.data.result
                            }
                        });
                    } else {
                        iframes.sendMsgAll({
                            event: 'eexcess.error',
                            data: res.data
                        });
                    }
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