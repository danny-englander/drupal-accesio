<?php

/**
 * @file
 * Functions to support theming in the Accesio theme.
 */

use Drupal\node\NodeInterface;
use Drupal\image\Entity\ImageStyle;

/**
 * Prepares variables for paragraph templates.
 *
 * Default template: paragraph.html.twig.
 *
 * Most themes use their own copy of paragraph.html.twig. The default is located
 * inside "templates/paragraph.html.twig". Look in there for the
 * full list of variables.
 *
 * @param array $vars
 *   An associative array containing:
 *   - elements: An array of elements to display in view mode.
 *   - paragraph: The paragraph object.
 *   - view_mode: View mode; e.g., 'full', 'teaser'...
 */
function accesio_preprocess_paragraph(array &$vars) {
  // Define various vars needed.
  // From paragraphs_theme_suggestions_paragraph.
  $paragraph = $vars['elements']['#paragraph'];
  // Define the bundle.
  $paragraph_bundle = $paragraph->bundle();
  // Define the node.
  $node = \Drupal::routeMatch()->getParameter('node');
  if ($node instanceof NodeInterface) {
    // Define the node title.
    $vars['node_title'] = $node->getTitle();
  }

  if (!empty($paragraph)) {
    // Array of $paragraph bundles.
    $paragraph_bundles = [
      'hero',
      'cta',
      'text_bg_image',
    ];

    // If in the array of bundles.
    if (in_array($paragraph_bundle, $paragraph_bundles)) {
      // If field_image is set.
      if (isset($vars["content"]["field_media"])) {
        // Check for the media bundle name.
        if (isset($vars["content"]["field_media"][0]["#media"]->bundle->target_id)) {
          // Define the media type bundle.
          $media_bundle = $vars["content"]["field_media"][0]["#media"]->bundle->target_id;
          // Array to target both bundles.
          $media_bundles = [
            'image',
            'remote_video',
          ];

          // Check for the media type image.
          if ($media_bundle === 'image') {
            // Set a variable for use in twig.
            $vars['is_media_image'] = TRUE;
          }

          // Check for the media type Remote video.
          if ($media_bundle === 'remote_video') {
            // Set a variable for use in twig.
            $vars['is_media_remote_video'] = TRUE;
          }
        }
      }

      // Field_component_background preprocessing.
      if (!empty($vars["content"]["field_media"][0]["#media"])) {
        // Get the public path to the image.
        if (!empty($vars["content"]["field_media"][0]["#media"]->field_media_image->entity->uri->value)) {
          $image_public_uri = $vars["content"]["field_media"][0]["#media"]->field_media_image->entity->uri->value;
          // Define the image attributes for use in the template.
          $vars["image_alt"] = $vars["content"]["field_media"][0]["#media"]->field_media_image->alt;
          $vars["image_width"] = $vars["content"]["field_media"][0]["#media"]->field_media_image->width;
          $vars["image_height"] = $vars["content"]["field_media"][0]["#media"]->field_media_image->height;
          // Define the image path using sf_hero_banner.
          // Other image styles can bet set for this as needed.
          $vars["image_style_hero"] = ImageStyle::load('max_2600x2600')
            ->buildUrl($image_public_uri);
        }
      }
    }

    // Check for the heading level list value.
    if ($paragraph->hasField('field_heading_level') &&
      !$paragraph->get('field_heading_level')->isEmpty()) {
      // Set a var for the top padding value.
      if ($paragraph->get('field_heading_level')->value === '1') {
        $vars['is_h1'] = TRUE;
      }
    }

    // Hero bundle.
    if ($paragraph_bundle === 'hero') {

      // Check for the field_remove_btm_margin boolean value.
      if ($paragraph->hasField('field_remove_btm_margin') &&
        !$paragraph->get('field_remove_btm_margin')->isEmpty()) {
        // If the value is true...
        if ($paragraph->get('field_remove_btm_margin')->value === '1') {
          // Add a class if the margin is to be removed.
          $vars['attributes']['class'][] = 'remove-bottom-margin';
        }
      }
    }

    // Columns bundle.
    if ($paragraph_bundle === 'columns') {

      // Check for the column count.
      if ($paragraph->hasField('field_components') &&
        !$paragraph->get('field_components')->isEmpty()) {
        $cols_items = $vars["elements"]["field_components"]["#items"];
        // Count the number of items in the array.
        $item_count = count($cols_items);
        // Add a class.
        $vars['attributes']['class'][] = 'columns--count-' . $item_count;
      }
    }

    // Timeline bundle.
    if ($paragraph_bundle === 'timeline') {

      if ($paragraph->hasField('field_timeline_style') &&
        !$paragraph->get('field_timeline_style')->isEmpty()) {
        $timeline_style = $paragraph->get('field_timeline_style')->value;
        // Define the timeline style for twig.
        $vars['timeline_style'] = $timeline_style;
      }

      if ($paragraph->hasField('field_timeline_bg') &&
        !$paragraph->get('field_timeline_bg')->isEmpty()) {
        $timeline_bg = $paragraph->get('field_timeline_bg')->value;
        // Add a class.
        $vars['timeline_bg'] = $timeline_bg;
      }
    }
  }
}


/**
 * Implements hook_theme_suggestions_paragraph_alter().
 */
function accesio_theme_suggestions_paragraph_alter(array &$suggestions, array $vars) {
  // Define various vars needed.
  // From paragraphs_theme_suggestions_paragraph.
  $paragraph = $vars['elements']['#paragraph'];
  // Define the bundle.
  $paragraph_bundle = $paragraph->bundle();

  // The paragraph bundle name, timeline_item.
  if ($paragraph_bundle === 'timeline_item') {
    // Check for the field_timeline_style list value.
    if (!empty($paragraph->getParentEntity()->field_timeline_style->value)) {
      // Get the host value and create a template suggestion based on that.
      $host_value = $paragraph->getParentEntity()->field_timeline_style->value;
      $suggestions[] = $vars['theme_hook_original'] . '__timeline_item__' . $host_value;
    }
  }
}
