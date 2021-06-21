<?php

/**
 * @file
 * Page Title functions to support theming in the Accesio theme.
 */

use Drupal\node\NodeInterface;

/**
 * Implements hook_preprocess_HOOK() for page title templates.
 */
function accesio_preprocess_region(array &$vars) {
  // Define the route.
  $route = \Drupal::routeMatch()->getRouteName();

  // Define an array of pages that are Layout Builder block layout pages.
  $layout_builder_admin_paths = [
    'layout_builder.overrides.node.view',
    'layout_builder.defaults.node.view',
    'layout_builder.overrides.node.revert',
    'layout_builder.defaults.node.view',
    'layout_builder.layout_library.node.view',
  ];

  // echo $route;

  // If the route matches, add the class to the pages above.
  if (in_array($route, $layout_builder_admin_paths)) {
    $vars['route'] = $route;
  }
}
