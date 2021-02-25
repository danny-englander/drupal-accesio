/**
 * Misc JS functions.
 * @file
 */
(function ($, Drupal, drupalSettings, once) {
  /*
  * Accesio Accordion.
   */
  Drupal.behaviors.accesioAccordion = {
    attach: function attach(context, settings) {
      // Instantiate an accordion.
      if ($().accordion) {
        $("[id^=js-accordion-id]").once('js-accordion').each(function () {
          $(this).accordion({
            buttonsGeneratedContent: "html"
          });
        });
      }
    }
  };

  /*
  * YTPlayer.
  */
  Drupal.behaviors.accesioYTPlayer = {
    attach: function attach(context, settings) {
      // Youtube video background.
      if ($().YTPlayer) {
        const video_url = $("#video-url");
        $(context).find(video_url).once("video-vimeo-bg").each(function () {
          // Instantiate the player.
          $(video_url).YTPlayer(); // Add custom A11y player controls.
          // Update the player controls.
          $.YTPlayer.controls.play = "<span role='button' tabindex='0'>" + Drupal.t('Play') + "</span>";
          $.YTPlayer.controls.pause = "<span role='button' tabindex='0'>" + Drupal.t('Pause') + "</span>"; // Detect when the video has started playing.
          $(video_url).on("YTPStart", function (e) {
            // Add a class if the video has started.
            $('#video-bg-container').addClass('is-started'); // console.log('started');
          });
        });
      }
    }
  };

  /*
  * vimeo_player.
  */
  Drupal.behaviors.accesioYTPlayer = {
    attach: function attach(context, settings) {
      // Vimeo video background.
      if ($().vimeo_player) {
        const video_url = $("#video-url");
        $(context).find(video_url).once("video-yt-bg").each(function () {
          // Instantiate the player.
          $(video_url).vimeo_player(); // Add custom A11y player controls.
          // Update the player controls.
          $.vimeo_player.controls.play = "<span role='button' tabindex='0'>" + Drupal.t('Play') + "</span>";
          $.vimeo_player.controls.pause = "<span role='button' tabindex='0'>" + Drupal.t('Pause') + "</span>"; // Detect when the video has started playing.
          // Add a class if the video has started.
          $(video_url).on("VPStart", function (e) {
            $('#video-bg-container').addClass('is-started'); // console.log('started');
          });
        });
      }
    }
  };

  /*
  * Megamenu.
  */
  Drupal.behaviors.accesioMegaMenu = {
    attach: function attach(context, settings) {
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
          openClass: "panel-is-open"
        });
      }
    }
  };

  /*
  * A11Y improvements.
  */
  Drupal.behaviors.accesioA11y = {
    attach: function attach(context, settings) {
      // Detect the "I am a keyboard user" key.
      // Check if the user is using keyboard navigation and if so, add a class.
      function handleFirstTab(e) {
        if (e.keyCode === 9) {
          document.body.classList.add("user-is-tabbing");
          window.removeEventListener("keydown", handleFirstTab);
        }
      }

      window.addEventListener("keydown", handleFirstTab);
    }
  };

  /*
* Custom views functions.
*/
  Drupal.behaviors.accesioViews = {
    attach: function attach(context, settings) {
      $(context).find('.filter-toggle').each(function () {
        $(this).on('click', function () {
          // console.log('hello');
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
    }
  };

  /*
  * Custom form functions.
  */
  Drupal.behaviors.accesioCheckboxes = {
    attach: function attach(context, settings) {
      // Find checkboxes, add markup.
      let outer_checkboxes = once('yay-only-once', context.querySelectorAll('.js-form-type-checkbox'));
      // Loop through each matched element.
      for (let i = 0; i < outer_checkboxes.length; i++) {
        // This is similar to jquery $(this).find('input.form-checkbox).
        let inner_inputs = outer_checkboxes[i].querySelectorAll("input.form-checkbox");
        // This is similar to jquery .after().
        // Since querySelectorAll returns a collection, we target with [0].
        inner_inputs[0].insertAdjacentHTML('afterend', '<span class="checkbox-toggle"><span class="checkbox-toggle__inner"></span></span>');
      }
    }
  };

  /*
  * Custom views functions.
  */
  Drupal.behaviors.accesioIcons = {
    attach: function attach(context, settings) {
      // Define variables for adding and removing classes
      // and using local storage to maintain the state.
      const outline_trigger = document.querySelector("#trigger-outline");
      const solid_trigger = document.querySelector("#trigger-solid");
      const body = document.querySelector("body");
      const icon_item = document.querySelectorAll('.icon-item__icon.material-icons'); // Test to check the state of local storage.

      if (localStorage.getItem('iconState') === 'outline_icon') {
        // Add a class if it's outline.
        body.classList.add("has-outline-icons");
        icon_item.forEach(element => element.classList.add('material-icons-outlined'));
        icon_item.forEach(element => element.classList.remove('material-icons'));
      }

      if (solid_trigger) {
        // Click action for the solid button.
        solid_trigger.addEventListener("click", function () {
          // console.log('solid')
          localStorage.setItem('iconState', 'solid_icon');
          body.classList.remove("has-outline-icons");
          icon_item.forEach(element => element.classList.remove('material-icons-outlined'));
          icon_item.forEach(element => element.classList.add('material-icons'));
        }, false);
      }

      if (outline_trigger) {
        // Click action for the outline button.
        outline_trigger.addEventListener("click", function () {
          //  console.log('outline')
          body.classList.add("has-outline-icons");
          localStorage.setItem('iconState', 'outline_icon');
          icon_item.forEach(element => element.classList.add('material-icons-outlined'));
          icon_item.forEach(element => element.classList.remove('material-icons'));
        }, false);
      }

      // Note, no clear Vanilla JS replacement as of yet for this bit of jQuery.
      $(document).ajaxComplete(function (event, xhr, settings) {
        // Query the state and then repeat the class add / remove.
        if (localStorage.getItem('iconState') === 'outline_icon') {
          icon_item.forEach(element => element.classList.add('material-icons-outlined'));
          icon_item.forEach(element => element.classList.remove('material-icons'));
        }
      });
    }
  };

  /*
  * Custom scroller.
  */
  Drupal.behaviors.scrollTo = {
    attach: function attach(context, settings) {
      // Define the element for the scroller.
      const scroller = document.getElementById('content-scroller');

      // Check for the scroller.
      if (scroller) {
        scroller.addEventListener('click', function () {
          // Target the anchor to be scrolled to.
          scrollTo(document.getElementById("content-target"));
        });

        // A11y add-on.
        scroller.addEventListener("keyup", function (event) {
          if (event.key === 'Enter') {
            // Trigger the click on return.
            scroller.click();
          }
        });
      }
    }
  };

  /*
  * Custom function to convert SVG img to an inline SVG.
  * See https://gist.github.com/Bloggerschmidt/61beeca2cce94a70c9df#gistcomment-3080717
  */
  Drupal.behaviors.AjaxEvent = {
    attach: function attach(context, settings) {
      $(document).once('exposed-form').ajaxComplete(function (event, xhr, settings) {
        if ($("#views-exposed-form-remix-icons-block" + name).length !== 0) {
          // console.log('hello');
        }
      });
    }
  };

  Drupal.behaviors.Masonry = {
    attach: function attach(context, settings) {
      // init Isotope

      if ($().isotope) {

        const grid = $('.grid').isotope({
          itemSelector: '.grid-item',
          percentPosition: true,
          masonry: {
            columnWidth: '.grid-sizer'
          }
        });

        // Layout Isotope after each image loads
        grid.imagesLoaded().progress(function () {
          grid.isotope('layout');
        });

        // Store filter for the group
        var filterFns = {};

// bind filter button click
        $('.filters-button-group').on('click', 'button', function () {
          var filterValue = $(this).attr('data-filter');
          // use filterFn if matches value
          filterValue = filterFns[filterValue] || filterValue;
          grid.isotope({filter: filterValue});
        });

// Change is-checked class on buttons
        $('.button-group').each(function (i, buttonGroup) {
          var $buttonGroup = $(buttonGroup);
          $buttonGroup.on('click', 'button', function () {
            $buttonGroup.find('.is-checked').removeClass('is-checked');
            $(this).addClass('is-checked');
          });
        });

      }
    }
  };

// ********* Custom Functions. *********.

// ScrollTo function.
  scrollTo = (element) => {
    window.scroll({
      behavior: 'smooth',
      left: 0,
      top: element.offsetTop
    });
  };

})(jQuery, Drupal, drupalSettings, once);
