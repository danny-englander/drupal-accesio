<?php

/**
 * @file
 * Functions to support theming in the Accesio theme.
 */

/**
 * Implements hook_theme_suggestions_HOOK_alter().
 */
function accesio_theme_suggestions_field_alter(array &$suggestions, array $vars) {
  // Used to add a generic field twig template without
  // any wrapping divs to have more control over styles.
  // * @see: https://www.previousnext.com.au/blog/bare-templates-removing-unnecessary-markup-twig-files
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
