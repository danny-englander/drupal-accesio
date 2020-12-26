<?php

/**
 * @file
 * Page functions to support theming in the Accesio theme.
 */

use Drupal\node\NodeInterface;

/**
 * Implements hook_preprocess_HOOK() for page.html.twig.
 *
 * @param array $vars
 */
function accesio_preprocess_page(array &$vars, $pid) {
  // Define vars for use in templates.
  $site_config = \Drupal::config('system.site');
  // Set a var for the logo path.
  $vars['theme_path'] = base_path() . $vars['directory'];
  // Set a var for the logo path.
  $vars['site_name'] = $site_config->get('name');
  // Define the route.
  $route = \Drupal::routeMatch()->getRouteName();
  // Define the node.
  $node = \Drupal::routeMatch()->getParameter('node');
  if ($node instanceof NodeInterface) {
    // Check if there are components.
    if (!empty($node->field_components->target_id)) {
      // Check to see if field_hide_title is checked off.
      if ($node->hasField('field_hide_title') &&
        !$node->get('field_hide_title')->isEmpty()) {
        // Add a class if there is a hero.
        if ($node->get('field_hide_title')->value === '1') {
          unset($vars['page']['content']['accesio_page_title']);
        }
      }
    }

    // Check for the field_edgy boolean value.
    if ($node->hasField('field_edgy') &&
      !$node->get('field_edgy')->isEmpty()) {
      // If the value is true, add a variable.
      if ($node->get('field_edgy')->value === '1') {
        $vars['no_container'] = TRUE;
      }
    }
  }
}
