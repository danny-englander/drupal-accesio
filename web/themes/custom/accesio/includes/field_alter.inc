<?php

/**
 * @file
 * Functions to support theming in the Accesio theme.
 */

/**
 * Implements hook_theme_suggestions_HOOK_alter().
 * Used to add a generic field twig template without any
 * wrapping divs to have more
 * control over styles.
 *
 * @see: https://www.previousnext.com.au/blog/bare-templates-removing-unnecessary-markup-twig-files
 */
function accesio_theme_suggestions_field_alter(array &$suggestions, array $vars) {
  // Get the element names passed on when a page is rendered.
  $field_name = $vars['element']['#field_name'];
  // Define the field element.
  $element = $vars['element'];

  // Build the string layout for the fields,
  // these fields will use the no-markup twig template.
  // <entity type>:<bundle name>:<view mode>:<field name>.
  $bare_hooks = [
    'paragraph:text:default:field_text_format',
    'media:twitter:default:field_media_twitter',
  ];

  // Build the actual var structure from second parameter.
  $hook = implode(':', [
    $vars['element']['#entity_type'],
    $vars['element']['#bundle'],
    $vars['element']['#view_mode'],
    $vars['element']['#field_name'],
  ]);

  // Check if the strings match and assign the bare template.
  if (in_array($hook, $bare_hooks, TRUE)) {
    $suggestions[] = 'field__no_markup';
  }
}

/**
 * Implements hook_preprocess_HOOK() for field.html.twig.
 */
function accesio_preprocess_field(&$vars, $hook) {
  // Get the element names passed on when a page is rendered.
}

/**
 * Implements hook_theme_suggestions_HOOK_alter() for node.
 */
function accesio_theme_suggestions_views_view_field_alter(array &$suggestions, array $vars) {
  // Define the fields and ids.
  $field = $vars["field"]->options["field"];
  $field_id = $vars["field"]->options["id"];
  $view_name = $vars["view"]->element["#name"];


  // If the field name is "nothing", create a theme hook.
  if ($view_name === 'icons' && $field === 'value' && $field_id === 'value_1') {
    // We do a custom theme hook suggestion here as in D8 views,
    // a custom field cannot fully render HTML.
    // see also accesio_preprocess_views_view_field
    // for custom variables set for the template.
    $a = 1;
    $suggestions[] = $vars['theme_hook_original'] . '__' . 'field_icons';
  }
}

/**
 * Implements preprocess_views_view_field.
 */
function accesio_preprocess_views_view_field(&$vars) {
  // Define the fields and ids.
  $field = $vars["field"]->options["field"];
  $field_id = $vars["field"]->options["id"];
  $view_name = $vars["view"]->element["#name"];
  $view_display = $vars["view"]->element["#display_id"];

  // If the field name is "nothing", set variables..
  if ($view_name === 'icons' && $field === 'value' && $field_id === 'value_1') {
    // Get the title.
//    $vars['row_title'] = $vars["row"]->_entity->getTitle();
    // The main view display for the landing page.
    if ($view_display === 'icons_block') {

      $vars['icon_code'] = $vars["row"]->code;
      $vars['icon_name'] = $vars["row"]->name;
    }
  }
}
