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
  // Get the form id.
  if ($form["#id"] === 'views-exposed-form-ion-icons-icons-block') {
  }
}
