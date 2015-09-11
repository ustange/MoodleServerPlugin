define(['jquery','local_eexcess/APIconnector','local_eexcess/iframes','local_eexcess/namedEntityRecognition'],function($,api,iframes,ner){
  //TODO
  //create HTML elements to hold realuts
  //render results after query response


  //Propreties

  //HTML elements
  var iframeUrl = "",
      container = $('<div id="eexcess_container" class="eexcess-wrapper"/>'),
      iframe = $('<iframe>'),
      button = $('<div class="sym-eexcess">'),
      resultIndicator=$('<div class="num-result">0</div>'),
      profile = null;
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
            container.append(iframe);
            button.appendTo($('body'));
            button.append(resultIndicator);
            resultIndicator.hide();
            
            
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
        button.on('click',function(){
              if(button.hasClass('active')){
                button.css({position:'absolute'});
                button.removeClass('active');
                container.animate({top:'-588px'},300,function(){
                  container.hide();
                });
                
              }else{
                
                button.addClass('active');
                container.show();
                container.animate({top:'43px'},300);
                button.css({position:'fixed'});
              }
            });
        
        window.addEventListener('message', function(e){
          window.console.log(e.data);
          if (e.data.event) {
            if (e.data.event === 'eexcess.paragraphEnd') {
                m._query(e.data.text);             
            }else if (e.data.event === 'eexcess.newSelection') {
                window.console.log(e.data.selection);              
            } else if (e.data.event === 'eexcess.queryTriggered') {

            } else if (e.data.event === 'eexcess.error') {
                //_showError(e.data.data);
            } else if (e.data.event === 'eexcess.rating') {
                //_rating($('.eexcess_raty[data-uri="' + e.data.data.uri + '"]'), e.data.data.uri, e.data.data.score);
            }
        }
        });
      },
      _updateResultNumber:function(numRes){
        window.console.log("Number of results:"+numRes);
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
        window.console.log("respose from entity detection");
        this._detectEntity(txt);
        iframes.sendMsgAll({event: 'eexcess.queryTriggered', data: profile});
        profile = {
            contextKeywords: [{
              text: txt,
              weight: 1.0
                    }]
        };
        api.query(profile, function (res) {
          window.console.log("query ended");
          window.console.log(res);
          that._updateResultNumber(res.data.totalResults);
          if (res.status === 'success') {
            iframes.sendMsgAll({event: 'eexcess.newResults', data: {profile: profile, results: { results: res.data.result }}});
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
        ner.entitiesAndCategories([text],function(r){
          window.console.log(r);
        })
      }
  };


  return {
    init:m.init
  }
})
