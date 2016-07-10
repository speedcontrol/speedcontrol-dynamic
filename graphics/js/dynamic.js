'use strict';
$(function () {

      var speedcontrolBundle = 'nodecg-speedcontrol';

      var sceneID = $('html').attr('data-sceneid');
      var sceneIDReplicant = nodecg.Replicant("sceneID",speedcontrolBundle, {defaultValue: sceneID});

      var runDataActiveRunReplicant = nodecg.Replicant("runDataActiveRun",speedcontrolBundle);
      runDataActiveRunReplicant.on("change", function (oldValue, newValue) {
          if(typeof newValue == 'undefined' || newValue == "") {
              return;
          }

          var aspectRatioKey = newValue.system;
          if( newValue.aspectRatio !== undefined ) {
              aspectRatioKey = newValue.aspectRatio;
          }


          updateGameCaptures( newValue.screens, newValue.system);
          updatePlayerContainers(newValue);

          sceneIDReplicant.value = generateSceneID(newValue);



      });

      sceneIDReplicant.on('change', function(oldValue, newValue) {
          if( oldValue == newValue )
          {
            return;
          }
          sceneID = newValue;
          if( oldValue ) {
            toggleStylesheets(false, oldValue);
          }
          loadCSS(sceneID, "/graphics/nodecg-speedcontrol/css/editcss/"+sceneID+".css");
          toggleStylesheets(false, sceneID);
          toggleStylesheets(true, sceneID);
      });

      function updateGameCaptures(screens, console_ ) {
          $('.gameCapture').each( function( index, element) {
              $(element).css('display', 'none');
              $(element).css('opacity', '0');
          });

          for( var i=0; i < screens.length; i++) {
              var capture = $('#gameCapture'+(i+1));
              var ar = screens[i].aspectRatio;
              if( typeof ar === 'undefined') {
                  ar = console_;
              }
              capture.attr('class',"gameCapture positionable");
              capture.attr("aspect-ratio", getAspectRatioString(ar));
              capture.css('display', 'block');
              capture.css('opacity', '1');
              capture.trigger("create");
              //location.reload();
          }
      }

      function updatePlayerContainers(runData) {
          $('.playerContainer').each(function() {
              $(this).css('opacity','0');
          });
          var count = 0;
          if( runData.teams.length > 1 ) {
              count = runData.teams.length;
          }
          else {
              count = runData.players.length;
          }
          for( var i=1; i <= count; i++ ) {
              var container = $('#player'+i+'Container');
              container.css('opacity', '1');
              container.trigger('create');

          }
      }

      function generateSceneID(runData) {
          var count = runData.screens.length;
          var aspectRatio = '';
          for( var i=0; i < runData.screens.length; i++ ) {
              aspectRatio+=runData.screens[i].aspectRatio;
              if( i !== (runData.screens.length-1) ) {
                  aspectRatio+='_';
              }
          }


          return nodecg.bundleName + "_" + count + "_" + aspectRatio.replace(':','-');
      }

      function getAspectRatioString(input) {
        switch(input.toUpperCase()) {
            case 'GB':
            case 'GBC':
                return "10:9"
                break;
            case 'HD':
            case 'PC':
            case 'XBOXONE':
            case 'PS4':
            case 'PS3':
            case 'Wii U':
                return "16:9";
                break;
            case '3DSBottom':
            case 'SD':
            case 'DS':
            case 'NES':
            case 'SNES':
            case 'GENESIS':
            case 'MEGADRIVE':
            case 'MEGA DRIVE':
            case 'Super NES':
            case 'AMIGA':
            case 'PLAYSTATION':
            case 'XBOX':
            case 'GCN':
            case 'GAMECUBE':
                return "4:3";
                break;
            case '3DSTop':
                return "5:3";
                break;
            case 'SMS':
            case 'GBA':
                return "3:2";
                break;
            default:
                return input;

        }
    }

    function loadCSS (sceneID, href) {
        var cssLink = $("<link rel='alternate stylesheet' title='"+sceneID+"' type='text/css' href='"+href+"'>");
        $("head").append(cssLink);
        cssLink.trigger('create');
    };

    function toggleStylesheets(enable, title) {

      $('link[title="'+title+'"]').each( function( index, element) {
        element.disabled = !enable;
      });
    }

});
