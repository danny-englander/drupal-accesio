<?php

/**
 * @file
 * Form functions to support theming in the DoR theme.
 */

use Drupal\Core\Form\FormStateInterface;

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
}
