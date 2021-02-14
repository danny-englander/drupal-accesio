<?php

/**
 * @file
 * Functions to support theming in the Accesio theme.
 */

use Drupal\node\NodeInterface;

/**
 * Prepares variables for node templates.
 */
function accesio_preprocess_node(array &$vars) {
}

/**
 * Implements hook_theme_suggestions_HOOK_alter().
 */
function accesio_theme_suggestions_node_alter(array &$suggestions, array $vars) {
  // Define the node.
  $node = \Drupal::routeMatch()->getParameter('node');
  $view_mode = $vars["elements"]["#view_mode"];
  // Check for a node instance.
  if ($node instanceof NodeInterface) {
    // Define the node type.
    $node_type = $node->getType();
  }
}
