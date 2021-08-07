"use strict";

(function (Drupal, once) {
  Drupal.behaviors.customCheckboxes = {
    attach: function attach(context) {
      // Find checkboxes, add markup.
      var outer_checkboxes = once('yay-only-once', context.querySelectorAll('.js-form-type-checkbox')); // Loop through each matched element.

      for (var i = 0; i < outer_checkboxes.length; i++) {
        // This is similar to jquery $(this).find('input.form-checkbox).
        var inner_inputs = outer_checkboxes[i].querySelectorAll("input.form-checkbox"); // This is similar to jquery .after().
        // Since querySelectorAll returns a collection, we target with [0].

        inner_inputs[0].insertAdjacentHTML('afterend', '<span class="checkbox-toggle"><span class="checkbox-toggle__inner"></span></span>');
      }
    }
  };
})(Drupal, once);