<?php

/**
 * @file
 * Page functions to support theming in the Accesio theme.
 */

use Drupal\node\NodeInterface;

/**
 * Implements hook_preprocess_HOOK() for html.html.twig.
 */
function accesio_preprocess_html(array &$vars) {
  // Define vars for use in templates.
  $site_config = \Drupal::config('system.site');
  // Set a var for the logo path.
  $vars['theme_path'] = base_path() . $vars['directory'];
  // Set a var for the logo path.
  $vars['site_name'] = $site_config->get('name');
  // Define the node.
  $node = \Drupal::routeMatch()->getParameter('node');
  // Check for a node instance.



  $route = \Drupal::routeMatch()->getRouteName();


  if ($node instanceof NodeInterface) {
//    echo 'im on a revision or a node';
    $a =1;
    // Define the nid.
    $nid = $node->id();
    // Add a nid class for internal reference.
    $vars['attributes']['class'][] = 'n' . $nid;

    // Define the node type.
    $node_type = $node->getType();
    // Check if there are components.
    if (!empty($node->field_components->target_id)) {
      // Check for the hero component.
      if ($node->hasField('field_hero') &&
        !$node->get('field_hero')->isEmpty()) {
        // Add a class if there is a hero.
        $vars['attributes']['class'][] = 'page-has-hero';
      }
    }

    // Check for field_hero.
    if ($node->hasField('field_hero') &&
      !$node->get('field_hero')->isEmpty()) {
      // Add a class if there is a hero.
      $vars['attributes']['class'][] = 'page-has-hero';
    }

    // Check for the field_edgy boolean value, add classes.
    if ($node->hasField('field_edgy') &&
      !$node->get('field_edgy')->isEmpty()) {
      // If the value is true, add a variable.
      if ($node->get('field_edgy')->value === '1') {
        $vars['attributes']['class'][] = 'page-full-width';
      }
      else {
        $vars['attributes']['class'][] = 'page-contained-width';
      }
    }

    // Define an array of node types that have structured content.
    $page_types = [
      'page',
    ];

    if (in_array($node_type, $page_types)) {
      $vars['attributes']['class'][] = 'page-standard';
    }

    // Define "blog" types.
    $blog_types = [
      'blog_post',
    ];

    if (in_array($node_type, $blog_types)) {
      $vars['attributes']['class'][] = 'page-blog page-contained-width';
    }
  }
}