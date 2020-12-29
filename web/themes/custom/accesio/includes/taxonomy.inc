<?php

/**
 * @file
 * Taxonomy functions to support theming in the Accesio theme.
 */

/**
 * Implements hook_preprocess_HOOK() for node.
 */
function accesio_preprocess_taxonomy_term(array &$vars) {
  /** @var \Drupal\taxonomy\TermInterface $term */
  $term = $vars['elements']['#taxonomy_term'];
  // Get the views current display.
  $view_mode = strtr($vars['elements']['#view_mode'], '.', '_');
  // Get taxonomy bundle.
  $bundle = $term->bundle();
}

/**
 * Implements hook_theme_suggestions_taxonomy_term_alter().
 */
function accesio_theme_suggestions_taxonomy_term_alter(array &$suggestions, array $vars) {
  /** @var \Drupal\taxonomy\TermInterface $term */
  $term = $vars['elements']['#taxonomy_term'];
  $view_mode = strtr($vars['elements']['#view_mode'], '.', '_');
  // Add view mode theme suggestions as
  // Drupal does not seem to do this out of the box.
  $suggestions[] = 'taxonomy_term__' . $view_mode;
  $suggestions[] = 'taxonomy_term__' . $term->bundle() . '__' . $view_mode;
  $suggestions[] = 'taxonomy_term__' . $term->id() . '__' . $view_mode;
}
