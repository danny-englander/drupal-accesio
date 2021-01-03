/*!
 Ridiculously Responsive Social Sharing Buttons Plus
*/

+(function(window, $, undefined) {
    'use strict';
    var schema = {
      size: {min: 0.1, max: 10, default: 1},
      shrink: {min: 0.2, max: 1, default: 0.8},
      regrow: {min: 0.2, max: 1, default: 0.8},
      minRows: {min: 1, max: 99, default: 1},
      maxRows: {min: 1, max: 99, default: 2},
      prefixReserve: {min: 0, max: 0.8, default: 0.3},
      prefixHide: {min: 0.1, max: 10, default: 2},
      alignRight: {type: 'boolean', default: false},
    };

    var oldJQuery = function() {
      // Check for old jQuery < 1.8.
      var verParts = $.fn.jquery.split('.');
      return ((verParts[0] == 1) && (verParts[1] < 8));
    }();

    /**
     * Public function to configure all sets of buttons on the page.
     */
    window.rrssbConfigAll = function(settings) {
      $('.rrssb').each(function(){
        $(this).rrssbConfig(settings);
      });
    }

    /**
     * Public function to configure the set of buttons.
     * $(this) points to an instance of .rrssb
     */
    $.fn.rrssbConfig = function(settings) {
      if ($(this).data('settings') && !settings) {
        return;
      }

      var checkedSettings = {};
      for (var param in schema) {
        checkedSettings[param] = schema[param].default;
        if (settings) {
          if (schema[param].type == 'boolean') {
            checkedSettings[param] = Boolean(settings[param]);
          }
          else if (!isNaN(parseFloat(settings[param]))) {
            checkedSettings[param] = Math.min(schema[param].max, Math.max(schema[param].min, settings[param]));
          }
        }
      }

      $(this).data('settings', checkedSettings);
      rrssbFix.call(this);
    };

    /**
     * Store original attribute values.
     * $(this) points to an instance of .rrssb
     */
    var rrssbInit = function() {
      // Clone the prefix so we can find the width when the text does not wrap.
      var $prefix = $('.rrssb-prefix', this);
      var $clone = $prefix.length ? $prefix.clone().css({visibility: 'hidden', 'white-space': 'nowrap', display: 'inline'}).appendTo(this) : null;

      // Remove any whitespace between the buttons because the browser will display it, breaking the resizing.
      $('ul').contents().filter(function() { return this.nodeType === Node.TEXT_NODE; }).remove();

      // Store original values.
      var orig = {
        width: 0,
        buttons: 0,
        height: $('li', this).innerHeight(),
        fontSize: parseFloat($(this).css("font-size")),
        prefixWidth: $clone ? $clone.innerWidth() : 0,
      };

      $('li', this).each(function() {
        orig.width = Math.max(orig.width, $(this).innerWidth());
        orig.buttons++;
      });

      $(this).data('orig', orig);
      if ($clone) $clone.remove();
      return orig;
    }

    /**
     * Fix all sets of buttons on the page.
     */
    var fixAll = function() {
      $('.rrssb').each(rrssbFix);
    }

    /**
     * Main recalculate sizes function.
     * $(this) points to an instance of .rrssb
     */
    var rrssbFix = function() {
      var orig = $(this).data('orig');
      if (!orig) {
        orig = rrssbInit.call(this);
      }
      var settings = $(this).data('settings');
      var buttonWidth = orig.width * settings.size;
      var buttons = orig.buttons;

      // Modern browsers have sub-pixel support, so an element can have a fractional width internally.
      // This can get rounded up in the result of innerWidth, so subtract 1px to get a safe width.
      var containerWidth = $(this).innerWidth() - 1;

      // Set all buttons to match width of largest.
      // This width stays no matter what sizing, but it may get constrained down by a max-width.
      // In the case where the buttons are in a float with no fixed width, having the full
      // width set on each button ensures that the float is able to grow back up from no-labels to having labels again.
      // However, the container can't shrink below the size of one button.
      // For small containers make sure we have small buttons.
      var cssWidth = (containerWidth < buttonWidth * settings.shrink) ? '' : buttonWidth;
      if (oldJQuery) {
        // Prior to jQuery 1.8, there was no setter for innerWidth, but width setter was bugged and acted like innerWidth.
        $('li', this).width(cssWidth);
      }
      else {
        $('li', this).innerWidth(cssWidth);
      }

      // Calculate widths.
      var availWidth = containerWidth / settings.shrink;
      var prefixWidth = orig.prefixWidth * settings.size;

      // Hide the prefix entirely if it is too big.
      if (prefixWidth > availWidth * settings.prefixHide) {
        prefixWidth = 0;
        $('.rrssb-prefix', this).css('display', 'none');
      }
      else {
        $('.rrssb-prefix', this).css('display', '');
      }

      var availWidthButtons = (prefixWidth <= containerWidth * settings.prefixReserve) ? availWidth - prefixWidth : availWidth;
      var buttonsPerRow = Math.floor(availWidthButtons / buttonWidth);

      // Fix labels.
      if (buttonsPerRow * settings.maxRows < buttons) {
        $(this).addClass('no-label');
        // Without label, button is square so width equals original height.
        buttonWidth = orig.height * settings.size;
        buttonsPerRow = Math.max(1, Math.floor(availWidthButtons / buttonWidth));
      }
      else {
        $(this).removeClass('no-label');
      }

      // Take account of min rows.
      // The actual number of rows may end up higher than the strict minimum.
      // Calculate how many buttons per row would give min-1 rows and require one less.
      // For 4 buttons and min 3 rows need max 1 button per row making 4 rows.
      // For 5 buttons and min 3 rows need max 2 button per row making 3 rows.
      // For 11 buttons and min 5 rows need max 2 buttons per row making 6 rows.
      var maxButtonsPerRow = (settings.minRows > 1) ? Math.max(1, Math.ceil(buttons / (settings.minRows - 1)) - 1) : buttons;
      buttonsPerRow = Math.min(buttonsPerRow, maxButtonsPerRow);

      // Adjust buttons per row to keep rows evenly balanced.
      // For 4 buttons and 3 buttons per row, it should be 2+2 not 3+1.
      // For 11 buttons and 5 buttons per row, it should be 4+4+3 not 5+5+1.
      buttonsPerRow = Math.ceil(buttons / Math.ceil(buttons / buttonsPerRow));

      // Do the same for the max value as we compare the two later.
      maxButtonsPerRow = Math.ceil(buttons / Math.ceil(buttons / maxButtonsPerRow));

      // Set max width.
      var percWidth = Math.floor(10000 / buttonsPerRow) / 100;
      $('li', this).css('max-width', percWidth + '%');

      // Test if we can fit the prefix inline.  This may be the case even if we didn't reserve space for it.
      var desiredWidth = buttonWidth * buttonsPerRow + prefixWidth;
      if (desiredWidth > availWidth) {
        desiredWidth -= prefixWidth;
        prefixWidth = 0;
      }

      // Fix font size.
      var maxScale = (buttonsPerRow < maxButtonsPerRow) ? settings.regrow : 1
      var scale = Math.min(maxScale, containerWidth / desiredWidth);
      // Reduce calculated value slightly as browser size calculations have some rounding and approximation.
      var fontSize = orig.fontSize * settings.size * scale * 0.98;
      $(this).css('font-size', fontSize + 'px');

      // Fix prefix.
      if (prefixWidth) {
         // Use a percentage so a small container doesn't inherit a huge pad after a radical rescale.
        var prefixPad = Math.floor(10000 * prefixWidth / desiredWidth) / 100;
        $('.rrssb-buttons', this).css('padding-left', prefixPad + '%');
        // Use absolute position to force onto same line - otherwise the buttons try to expand to full width and so start on a new line.
        $('.rrssb-prefix', this).css('position', 'absolute');
        var rowsNeeded = Math.ceil(buttons / buttonsPerRow);
        var prefixHeight = rowsNeeded * orig.height / orig.fontSize;
        $('.rrssb-prefix', this).css('line-height', prefixHeight + 'em');
      }
      else {
        $('.rrssb-buttons', this).css('padding-left', '');
        $('.rrssb-prefix', this).css('position', '');
        $('.rrssb-prefix', this).css('line-height', '');
      }

      // Set padding to constrain buttons to desired width and they wrap evenly, for example 6 => 3+3 not 4+2.
      var paddingAttr = settings.alignRight ? 'padding-left' : 'padding-right';
      if (scale >= maxScale * 0.999) {
        // Use a percentage so a small container doesn't inherit a huge pad after a radical rescale.
        // Allow a little extra to ensure rounding error doesn't accidentally spread buttons onto extra lines.
        var padding = Math.floor(10000 * (containerWidth - desiredWidth*scale*1.02) / containerWidth) / 100;
        $(this).css(paddingAttr, padding + '%');
      }
      else {
        $(this).css(paddingAttr, '');
      }
    };

    var popupCenter = function(url, title, w, h) {
      // Fixes dual-screen position                         Most browsers      Firefox
      var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
      var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

      var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
      var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

      var left = ((width / 2) - (w / 2)) + dualScreenLeft;
      var top = ((height / 3) - (h / 3)) + dualScreenTop;

      var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

      // Puts focus on the newWindow
      if (newWindow && newWindow.focus) {
        newWindow.focus();
      }
    };

    var timer;
    var delayedFixAll = function(ms) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(fixAll, ms ? ms : 200);
    };

    /**
     * Ready function
     */
    $(document).ready(function() {
        // Register event listeners
        $('.rrssb-buttons a.popup').click(function popUp(e) {
            popupCenter($(this).attr('href'), $(this).find('.rrssb-text').html(), 580, 470);
            e.preventDefault();
        });

        $(window).resize(delayedFixAll);

        // Add another ready callback that will be called after all others.
        // Configure any buttons that haven't already been configured.
        $(document).ready(function() { rrssbConfigAll(); });
    });

})(window, jQuery);
