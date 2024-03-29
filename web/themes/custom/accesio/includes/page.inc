<?php

/**
 * @file
 * Page functions to support theming in the Accesio theme.
 */

use Drupal\node\NodeInterface;

/**
 * Implements hook_preprocess_HOOK() for page.html.twig.
 */
function accesio_preprocess_page(array &$vars) {
  // Define vars for use in templates.
  $site_config = \Drupal::config('system.site');
  // Set a var for the logo path.
  $vars['theme_path'] = base_path() . $vars['directory'];
  // Set a var for the logo path.
  $vars['site_name'] = $site_config->get('name');
  // Logged in user.
  $vars['user_logged_in'] = \Drupal::currentUser()->isAuthenticated();
  // Define the route.
  $route = \Drupal::routeMatch()->getRouteName();
  // Define the node.
  $node = \Drupal::routeMatch()->getParameter('node');
  if ($node instanceof NodeInterface) {
    // Check to see if field_hide_title is checked off.
    if ($node->hasField('field_hide_title') &&
      !$node->get('field_hide_title')->isEmpty()) {
      // Add a class if there is a hero.
      if ($node->get('field_hide_title')->value === '1') {
        unset($vars['page']['content_top']['accesio_page_title']);
      }
    }

    // Check for field_hero.
    if ($node->hasField('field_hero') &&
      !$node->get('field_hero')->isEmpty()) {
      // Do an extra check for the target id.
      if (!empty($node->field_hero->target_id)) {
        // If hero component is set, remove the standard page title.
        unset($vars['page']['content_info']['pagetitle']);
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

  // Define an array of pages that are Layout Builder block layout pages.
  $layout_builder_admin_paths = [
    'layout_builder.overrides.node.view',
    'layout_builder.defaults.node.view',
    'layout_builder.overrides.node.revert',
    'layout_builder.defaults.node.view',
    'layout_builder.layout_library.node.view',
  ];

  // If the route matches, add the class to the pages above.
  if (in_array($route, $layout_builder_admin_paths)) {
    $vars['#attached']['library'][] = 'accesio/layout_builder_ui';
  }
}
