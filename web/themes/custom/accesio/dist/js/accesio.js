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

  /*
* Megamenu.
*/
  Drupal.behaviors.accesioMegaMenu = {
    attach: function (context, settings) {
      // Accessible Mega menu.
      if ($().accessibleMegaMenu) {
        // Initialize the megamenu.
        $("#main-menu").accessibleMegaMenu({
          /* prefix for generated unique id attributes, which are required
             to indicate aria-owns, aria-controls and aria-labelledby  */
          uuidPrefix: "main_menu",
          /* css class used to define the megamenu styling */
          menuClass: "main-menu__item-list",
          /* css class for a top-level navigation item in the megamenu */
          topNavItemClass: "nav-item",
          /* css class for a megamenu panel */
          panelClass: "main-menu__sub-nav",
          /* css class for a group of items within a megamenu panel */
          panelGroupClass: "sub-nav-group",
          /* css class for the hover state */
          hoverClass: "hover",
          /* css class for the focus state */
          focusClass: "focus1",
          /* css class for the open state */
          openClass: "panel-is-open",
        });
      }
    },
  };

  /*
  * A11Y improvements.
  */
  Drupal.behaviors.accesioA11y = {
    attach: function (context, settings) {
      // Detect the "I am a keyboard user" key.
      // Check if the user is using keyboard navigation and if so, add a class.
      function handleFirstTab(e) {
        if (e.keyCode === 9) {
          document.body.classList.add("user-is-tabbing");
          window.removeEventListener("keydown", handleFirstTab);
        }
      }

      window.addEventListener("keydown", handleFirstTab);
    },
  };

  /*
  * Custom form functions.
  */
  Drupal.behaviors.accesioFormUpdates = {
    attach: function (context, settings) {
      $(context).find('.js-form-type-checkbox').once().each(function () {
        $(this).find('input.form-checkbox').after('<span class="checkbox-toggle"><span class="checkbox-toggle__inner"></span></span>');
      });
    },
  };

  /*
* Custom views functions.
*/
  Drupal.behaviors.accesioViews = {
    attach: function (context, settings) {
      $(context).find('.filter-toggle').each(function () {
        $(this).on('click', function () {
          console.log('hello');
          $(this).toggleClass('filter-toggle-expanded');
          $(this).parent().find('.view-filters').toggleClass('filters-expanded');
        });

        // @TODO Need to target specific form ids.
        // Add localStorage to remember settings.

        // @TODO Need to target specific form ids.
        $(document).ajaxComplete(function (event, xhr, settings) {
          $(context).find('.filter-toggle').each(function () {
            $(this).addClass('filter-toggle-expanded');
            $(this).parent().find('.view-filters').addClass('filters-expanded');
          });
        });
      });
    },
  };

  /*
  * Custom function to convert SVG img to an inline SVG.
  * See https://gist.github.com/Bloggerschmidt/61beeca2cce94a70c9df#gistcomment-3080717
  */
  Drupal.behaviors.svgConvert = {
    attach: function (context, settings) {
      // document.querySelectorAll('img.svg-img-to-inline').forEach((el) => {
      //   const imgID = el.getAttribute('id');
      //   const imgClass = el.getAttribute('class');
      //   const imgURL = el.getAttribute('src');
      //
      //   fetch(imgURL)
      //     .then(data => data.text())
      //     .then(response => {
      //       const parser = new DOMParser();
      //       const xmlDoc = parser.parseFromString(response, 'text/html');
      //       let svg = xmlDoc.querySelector('svg');
      //
      //       if (typeof imgID !== 'undefined') {
      //         svg.setAttribute('id', imgID);
      //       }
      //
      //       if(typeof imgClass !== 'undefined') {
      //         svg.setAttribute('class', imgClass + ' replaced-svg');
      //       }
      //
      //       svg.removeAttribute('xmlns:a');
      //       el.parentNode.replaceChild(svg, el);
      //     })
      // });
    },
  };

}(Drupal, jQuery));
