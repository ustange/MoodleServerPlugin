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

define(['jquery', 'local_eexcess/APIconnector', 'local_eexcess/iframes', 'local_eexcess/md5','local_eexcess/paragraphDetection'], function ($, api, iframes, md5,pDet) {
    //TODO
    //create HTML elements to hold realuts
    //render results after query response

    function createUserID(clientType, userName) {
        return md5.getHash(clientType + userName);
    }
    var interestsText = undefined;
    var queryId = undefined;
    var userId = undefined;
    var gotDashboardSettings = false;
    var origin = {
            
            clientType: "EEXCESS - Moodle Plugin",
            clientVersion: "1.0",
            userID: "undefined",
            module: "eexcess"
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
        init: function (base_url, userid, rec_base_url,interests) { // plugin initializer
            interestsText = interests;
            userId = userid;
            
            origin.userID = createUserID(origin.clientType, userId);
            api.init({origin:origin,base_url:rec_base_url});
            
           
            
            //config.origin.userID = createUserID(config.origin.clientType, userId);
            
            iframeUrl = "https://eexcess.github.io/visualization-widgets/Dashboard/"; //+
            /*var eventData = {
                    origin: config.origin,
                    content: {
                        name: "MoodleEExcess",
                    }
                };*/
                
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
            button.appendTo($('body'));
            button.append(resultIndicator);
            button.css({
                position: 'fixed'
            });
            resultIndicator.hide();
            iframe.on("load", function () {
              if(!gotDashboardSettings){
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
              }
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
                
                if (e.data.event) {
                    if(e.data.data){
                        e.data.data.origin=origin;
                    }
                    if (e.data.event === 'eexcess.paragraphEnd') {
                        if(!gotDashboardSettings){
                            gotDashboardSettings=true;
                            window.postMessage({
                                event: 'eexcess.newDashboardSettings',
                                settings: {
                                    selectedChart: 'timeline',
                                    hideCollections: false,
                                    showLinkImageButton: true,
                                    showLinkItemButton: true,
                                    showScreenshotButton: true
                                }
                            },'*');
                        }
                        m._query(e.data.text);
                    } else if (e.data.event === 'eexcess.newSelection') {

                    } else if (e.data.event === 'eexcess.queryTriggered') {

                    } else if (e.data.event === 'eexcess.error') {
                        //_showError(e.data.data);
                    } else if (e.data.event === 'eexcess.openDashboard') {
                        button.trigger('click');
                    } else if (e.data.event === 'eexcess.newDashboardSettings') {
                        gotDashboardSettings = true;
                        iframes.sendMsgAll(e.data);
                    }else if (e.data.event === 'eexcess.rating') {
                        //_rating($('.eexcess_raty[data-uri="' + e.data.data.uri + '"]'), e.data.data.uri, e.data.data.score);
                    }else if(e.data.event=='eexcess.log.itemCitedAsImage'){
                        api.sendLog(api.logInteractionType.itemCitedAsImage, e.data.data, function(r) { window.console.log(r);});
                    }else if(e.data.event=='eexcess.log.itemCitedAsText'){
                        api.sendLog(api.logInteractionType.itemCitedAsText, e.data.data, function(r) { window.console.log(r);});
                    }else if(e.data.event=='eexcess.log.itemCitedAsHyperlink'){
                        api.sendLog(api.logInteractionType.itemCitedAsHyperlink, e.data.data, function(r) { window.console.log(r);});
                    }else if(e.data.event=='eexcess.log.moduleOpened'){
                        api.sendLog(api.logInteractionType.moduleOpened, e.data.data, function(r) { window.console.log(r);});
                    }else if(e.data.event=='eexcess.log.moduleClosed'){
                        api.sendLog(api.logInteractionType.moduleClosed, e.data.data, function(r) { window.console.log(r);});
                    }else if(e.data.event=='eexcess.log.moduleStatisticsCollected'){
                        api.sendLog(api.logInteractionType.moduleStatisticsCollected, e.data.data, function(r) { window.console.log(r);});
                    }else if(e.data.event=='eexcess.log.itemRated'){
                        api.sendLog(api.logInteractionType.itemRated, e.data.data, function(r) { window.console.log(r);});
                    }else if(e.data.event=='eexcess.log.itemOpened'){
                        api.sendLog(api.logInteractionType.itemOpened, e.data.data, function(r) { window.console.log(r);});
                    }else if(e.data.event=='eexcess.log.itemClosed'){
                        api.sendLog(api.logInteractionType.itemClosed, e.data.data, function(r) { window.console.log(r);});
                    }else{
                        //window.console.log("unknown event recieved!");
                        //window.console.log(e.data);   
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
                
                profile.interests = interestsText;
                profile.origin=origin;
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