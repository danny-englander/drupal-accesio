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

  // Font Awesome icons vocab bundle.
  if (!empty($bundle) && $bundle === 'fa_icons') {
    // Test for the key.
    if (!empty($vars["elements"]["#taxonomy_term"]->get('field_fa_key')->getString())) {
      // Get the FA key. e.g. "cart".
      $vars["fa_key"] = $vars["elements"]["#taxonomy_term"]->get('field_fa_key')->getString();
      $vars["fa_unicode"] = $vars["elements"]["#taxonomy_term"]->get('field_fa_unicode')->getString();
      // Get the FA style, e.g. solid or brands.
      $fa_key = $vars["elements"]["#taxonomy_term"]->get('field_fa_style')->getString();
      // Define variables for each style. e.g. "fas" or "fab".
      if ($fa_key === 'solid') {
        // fas.
        $vars["field_fa_style"] = 's';
      }
      // fab.
      elseif ($fa_key === 'brands') {
        $vars["field_fa_style"] = 'b';
      }
      // far.
      elseif ($fa_key === 'regular') {
        $vars["field_fa_style"] = 'r';
      }
    }
  }
}

/**
 * Implements hook_theme_suggestions_taxonomy_term_alter().
 */
function accesio_theme_suggestions_taxonomy_term_alter(array &$suggestions, array $vars) {
  /** @var \Drupal\taxonomy\TermInterface $term */
  $term = $vars['elements']['#taxonomy_term'];
  $view_mode = strtr($vars['elements']['#view_mode'], '.', '_');
  // Add view mode and bundle theme suggestions as
  // Drupal does not seem to do this out of the box.
  $suggestions[] = 'taxonomy_term__' . $view_mode;
  $suggestions[] = 'taxonomy_term__' . $term->bundle() . '__' . $view_mode;
  $suggestions[] = 'taxonomy_term__' . $term->id() . '__' . $view_mode;
}
