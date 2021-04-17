<?php

/**
 * @file
 * Form functions to support theming in the DoR theme.
 */

use Drupal\Core\Form\FormStateInterface;
use Drupal\taxonomy\Entity\Term;

/**
 * Implements hook_form_alter().
 */
function accesio_form_alter(&$form, FormStateInterface $form_state, $form_id) {
  // Form alters by id.
  if ($form["#id"] === 'views-exposed-form-fa-icons-fa-solids-block') {
    $form["#attributes"]["class"][] = 'label-is-hidden';
  }

  if ($form["#id"] === 'views-exposed-form-fa-icons-fa-brands-block') {
    $form["#attributes"]["class"][] = 'label-is-hidden';
  }

  if ($form["#id"] === 'views-exposed-form-fa-icons-fa-regular-block') {
    $form["#attributes"]["class"][] = 'label-is-hidden';
  }

  if ($form['#id'] == 'views-exposed-form-remix-icons-remix-icons-block') {
    // Convert text field values from field_ri_icon_category into a select list.
    // Based on https://www.drupal.org/paid-services/2012-04-26/solved-d7views-small-module-to-turn-text-field-to-dropdown-list-when#comment-12052720
    $tids = \Drupal::entityQuery('taxonomy_term')
      ->condition('vid', 'remix_icons')
      ->sort('field_ri_icon_category', 'ASC')
      ->execute();

    $terms = Term::loadMultiple($tids);

    $options = ['' => 'All'];

    foreach ($terms as $tid => $term) {
      $value = $term->get('field_ri_icon_category')->getString();

      if (isset($value)) {
        $options[$value] = $value;
      }
    }

    // The updated field that now renders as a select list.
    if (isset($form['icon_cat_value'])) {
      $form['icon_cat_value']['#type'] = 'select';
      $form['icon_cat_value']['#options'] = $options;
      $form['icon_cat_value']['#size'] = 1;
    }
  }
}
