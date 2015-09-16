//define(['jquery','local_eexcess/APIconnector','local_eexcess/iframes','local_eexcess/namedEntityRecognition'],function($,api,iframes,ner){
define(['jquery','local_eexcess/APIconnector','local_eexcess/iframes'],function($,api,iframes){
  //TODO
  //create HTML elements to hold realuts
  //render results after query response


  //Propreties

  //HTML elements
  var iframeUrl = "",
      container = $('<div id="eexcess_container" class="eexcess-wrapper"/>'),
      iframe = $('<iframe>'),
      button = $('<div id="eexcess_button" class="sym-eexcess">'),
      resultIndicator=$('<div class="num-result">0</div>'),
      profile = null,
      nextStep = function(){
        var width = 50,
            finalFrame = 3;
            
        loader.currentFrame = loader.currentFrame<finalFrame ? loader.currentFrame+1 : 0;
        var bp = width*loader.currentFrame;
          $("#eexcess_button").css('background-position',"-"+bp+"px 0px");
          
        
      },
      loader = {
        interval:null,
        currentFrame:0,
        start:function(){
          this.interval = window.setInterval(nextStep,300);
          
        },
        stop:function(){
          window.clearInterval(this.interval);
          $("#eexcess_button").css('background-position',"0px 0px");
          
        }
      };
  //Methods
  var m = {
      //PUBLIC METHODS
      init:function(base_url){ // plugin initializer
        iframeUrl = base_url + "/local/eexcess/dashboard/index.html"+"?rnd="+Math.random();
        m._bindControls();
        m._createUI();
      },

      //PRIVATE METHODS
      _createUI:function(){
            
            container.appendTo($('body'));
            iframe.attr('src',iframeUrl);
			iframe.attr('id','moodleEEXCESSdashboard');
            container.append(iframe);
            button.appendTo($('body'));
            button.append(resultIndicator);
			button.css({position:'fixed'});
            resultIndicator.hide();
			iframe.on("load",function(){
				iframes.sendMsgAll({event: 'eexcess.newDashboardSettings', settings: {
					selectedChart: 'timeline',
					hideCollections: true,
					showLinkImageButton: true,
					showLinkItemButton: true
				}});
			});
            
			

            
      },
      _bindControls:function(){ // self explanatory
        
           
        $('body').on('mouseup',function(e){
          var elm = $(e.target);
          //check if selection event is triggered.
          var isEditor = (elm.parents('.editor_atto_content').length || elm.hasClass('editor_atto_content'))
          var text = m._getSelectionText();
          if(text && text.length > 3 && !isEditor){
            m._query(text);
            }
      
        })
        button.on('click',function(e){
              if(button.hasClass('active')){
                //button.css({position:'absolute'});
                button.removeClass('active');
                container.animate({top:'-588px'},300,function(){
                  container.hide();
                });
                
              }else{
				// initialize the visualization dashboard - had it in _createUI but this was a little bit too early. 
				//var elm = $('.editor_atto_content');
				//window.console.log("elm: "+elm);
				var isEditor = window.location.href.indexOf('post.php')!=-1;
				if(isEditor){
					window.console.log("initializing dashboard to show citationbuttons");
					iframes.sendMsgAll({event: 'eexcess.newDashboardSettings', settings: {
						//selectedChart: 'timeline',
						hideCollections: false,
						showLinkImageButton: true,
						showLinkItemButton: true,
						showScreenshotButton: true
					}});
				}
				else{
					window.console.log("initializing dashboard for content consumption");
					
					iframes.sendMsgAll({event: 'eexcess.newDashboardSettings', settings: {
						hideCollections: false,
						showLinkImageButton: false,
						showLinkItemButton: false,
						showScreenshotButton: false
					}});
				}
				
                button.addClass('active');
				container.css({visibility:'visible'});
                container.show();
                container.animate({top:'43px'},300);
                //button.css({position:'fixed'});
              }
            });
           
        
        window.addEventListener('message', function(e){
          
          if (e.data.event) {
            if (e.data.event === 'eexcess.paragraphEnd') {
                m._query(e.data.text);             
            }else if (e.data.event === 'eexcess.newSelection') {
                             
            } else if (e.data.event === 'eexcess.queryTriggered') {

            } else if (e.data.event === 'eexcess.error') {
                //_showError(e.data.data);
            } else if (e.data.event === 'eexcess.rating') {
                //_rating($('.eexcess_raty[data-uri="' + e.data.data.uri + '"]'), e.data.data.uri, e.data.data.score);
            } else if (e.data.event === 'eexcess.newResults') {
                
            }
        }
        });
      },
      _updateResultNumber:function(numRes){
        
        
        if(numRes>0){
                  resultIndicator.empty().append(numRes);
                  resultIndicator.show();
                }else{
                  resultIndicator.empty().append(numRes);
                  resultIndicator.hide()
                }
      },
      _query:function(txt){//query api with currently selected text
        var that = this;
        
        this._detectEntity(txt);
        loader.start();
        iframes.sendMsgAll({event: 'eexcess.queryTriggered', data: profile});
		that._updateResultNumber(0);
          
        profile = {
            numResults: 100,
			//origin: {Clienttype:"Moodle", ClientVersion: '1.0', uuid: 'hash(username)'}, // prepared for explicit logging
			contextKeywords: [{
              text: txt,
              weight: 1.0
                    }]
        };
        api.query(profile, function (res) {
          loader.stop();
          that._updateResultNumber(res.data.totalResults);
          if (res.status === 'success') {
            iframes.sendMsgAll({event: 'eexcess.newResults', data: {profile: profile, result: res.data.result }});
          } else {
            iframes.sendMsgAll({event:'eexcess.error', data: res.data});
          }
        });
      },
      _getSelectionText:function() { // returns currently selected text
        var text = "";
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
        }
        return text;
      },
      _detectEntity:function(text){
        /*ner.entitiesAndCategories([text],function(r){
          
        })*/
      }
  };


  return {
    init:m.init
  }
})
