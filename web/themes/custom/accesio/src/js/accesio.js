/**
 * Misc JS functions.
 * @file
 */
(function (Drupal, $) {
  /*
  * Accesio Accordion.
   */
  Drupal.behaviors.accesioAccordion = {
    attach: function (context, settings) {
      // Instantiate an accordion.
      if ($().accordion) {
        $("[id^=js-accordion-id]").once('js-accordion').each(function () {
          $(this).accordion({
            buttonsGeneratedContent: "html",
          });
        });
      }
    },
  };

  /*
* YTPlayer.
 */
  Drupal.behaviors.accesioYTPlayer = {
    attach: function (context, settings) {
      // Youtube video background.
      if ($().YTPlayer) {
        video_url = $("#video-url");
        $(context).find(video_url).once("video-vimeo-bg").each(function () {
          // Instantiate the player.
          $(video_url).YTPlayer();
          // Add custom A11y player controls.
          $.YTPlayer.controls.play = "<span role='button' tabindex='0'>" + Drupal.t('Play') + "</span>";
          $.YTPlayer.controls.pause = "<span role='button' tabindex='0'>" + Drupal.t('Pause') + "</span>";
          // Detect when the video has started playing.
          $(video_url).on("YTPStart", function (e) {
            $('#video-bg-container').addClass('is-started');
            // console.log('started');
          });
        });
      }
    },
  };

  /*
* vimeo_player.
*/
  Drupal.behaviors.accesioYTPlayer = {
    attach: function (context, settings) {
      // Vimeo video background.
      if ($().vimeo_player) {
        video_url = $("#video-url");
        $(context).find(video_url).once("video-yt-bg").each(function () {
          // Instantiate the player.
          $(video_url).vimeo_player();
          // Add custom A11y player controls.
          $.vimeo_player.controls.play = "<span role='button' tabindex='0'>" + Drupal.t('Play') + "</span>";
          $.vimeo_player.controls.pause = "<span role='button' tabindex='0'>" + Drupal.t('Pause') + "</span>";
          // Detect when the video has started playing.
          $(video_url).on("VPStart", function (e) {
            $('#video-bg-container').addClass('is-started');
            // console.log('started');
          });
        });
      }
    },
  };
}(Drupal, jQuery));
