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
          openClass: "open",
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
  * MasonrySearch.
  */
  Drupal.behaviors.accesioMasonrySearch = {
    attach: function (context, settings) {
      // quick search regex
      var qsRegex;
      // init Isotope
      var $grid = $('.grid').isotope({
        itemSelector: '.element-item',
        layoutMode: 'fitRows',
        filter: function () {
          return qsRegex ? $(this).text().match(qsRegex) : true;
        }
      });

      // use value of search field to filter
      var $quicksearch = $('.quicksearch').keyup(debounce(function () {
        qsRegex = new RegExp($quicksearch.val(), 'gi');
        $grid.isotope();
      }, 200));

      // debounce so filtering doesn't happen every millisecond
      function debounce(fn, threshold) {
        var timeout;
        threshold = threshold || 100;
        return function debounced() {
          clearTimeout(timeout);
          var args = arguments;
          var _this = this;

          function delayed() {
            fn.apply(_this, args);
          }

          timeout = setTimeout(delayed, threshold);
        };
      }
    },
  };

  Drupal.behaviors.accesioInlineSearch = {
    attach: function (context, settings) {
      // $(".inline-search").on("keyup", function () {
      //   const value = $(this).val();
      //   $(".results").removeClass("results");
      //
      //   $(".searchable").each(function () {
      //     if (value !== "" && $(this).text().search(new RegExp(value, 'gi')) !== -1) {
      //       $(this).addClass("results");
      //       $(this).parents().eq(1).addClass("icon-item--has-results");
      //     } else if (value !== "" && $(this).text().search(value) !== 1) {
      //       $(this).addClass("noresults")
      //       $(this).parents().eq(1).addClass("icon-item--no-results");
      //     }
      //   });
      // });
    },
  };

}(Drupal, jQuery));
