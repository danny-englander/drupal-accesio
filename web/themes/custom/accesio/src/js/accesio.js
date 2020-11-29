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
        console.log('foo');
        $("[id^=js-accordion-id]").once('js-accordion').each(function () {
          $(this).accordion({
            buttonsGeneratedContent: "html",
          });
        });
      }
    },
  };

}(Drupal, jQuery));
