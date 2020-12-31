<?php

/**
 * @file
 * Page Title functions to support theming in the Accesio theme.
 */

use Drupal\node\NodeInterface;

/**
 * Implements hook_preprocess_HOOK() for page-title.html.twig.
 *
 * @param array $vars
 */
function accesio_preprocess_page_title(array &$vars, $pid) {
  // Define the node.
  $node = \Drupal::routeMatch()->getParameter('node');

  // If it's a node.
  if ($node instanceof NodeInterface) {
    // Check for field_svg_icon.
    if ($node->hasField('field_svg_icon') &&
      !$node->get('field_svg_icon')->isEmpty()) {
      // Get the pubic image URI, e.g. public://2020-12/file-list-2-line.svg.
      $svg_icon = $node->get('field_svg_icon')->entity->getFileUri();
      $vars["image_svg"] = file_create_url($svg_icon);
      $vars["image_alt"] = $node->get("field_svg_icon")->alt;
    }
  }
}
