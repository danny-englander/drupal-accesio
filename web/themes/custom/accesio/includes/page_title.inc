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
    $node_type = $node->getType();
    // Check for field_svg_icon.
    if ((!empty($node) && $node->hasField('field_svg_icon')) &&
      !$node->get('field_svg_icon')->isEmpty()) {
      // Get the pubic image URI, e.g. public://2020-12/file-list-2-line.svg.
      $svg_icon = $node->get('field_svg_icon')->entity->getFileUri();
      // Image path variable.
      $vars["image_svg"] = file_create_url($svg_icon);

      if (!empty($node->get("field_svg_icon")->alt)) {
        // Alt tag variable.
        $vars["image_alt"] = $node->get("field_svg_icon")->alt;
      }
    }

    if (!empty($node)) {
      $vars["node_type"] = $node_type;
    }
  }
}

/**
 * Implements hook_theme_suggestions_HOOK_alter().
 *
 * @see: https://www.previousnext.com.au/blog/bare-templates-removing-unnecessary-markup-twig-files
 */
function accesio_theme_suggestions_page_title_alter(array &$suggestions, array $vars) {
  // Define the node.
  $node = \Drupal::routeMatch()->getParameter('node');
  // Check for a node instance.
  if ($node instanceof NodeInterface) {
    // Define the node type.
    $node_type = $node->getType();
    // Define page type.
    $page_types = [
      'page',
    ];
    if (in_array($node_type, $page_types)) {
      $suggestions[] = $vars['theme_hook_original'] . '__page';
    }

    // Define "blog" types.
    $blog_types = [
      'blog_post',
    ];
    if (in_array($node_type, $blog_types)) {
      $suggestions[] = $vars['theme_hook_original'] . '__blog';
    }
  }
}
