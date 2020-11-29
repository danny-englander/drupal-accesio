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

      // Check for the hero component.
      if ($node->hasField('field_hero') &&
        !$node->get('field_hero')->isEmpty()) {
        // Add a class if there is a hero.
        if (!empty($node->field_hero)) {
          unset($vars['page']['content']['accesio_page_title']);
        }
      }
    }
  }
}
