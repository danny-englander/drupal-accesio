<?php

/**
 * @file
 * Functions to support theming in the UCSF Diabetes theme.
 */

use Drupal\node\NodeInterface;
use Drupal\image\Entity\ImageStyle;
use Drupal\Component\Utility\Html;

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
      if (isset($vars["content"]["field_image"])) {
        // Check for the media bundle name.
        if (isset($vars["content"]["field_image"][0]["#media"]->bundle->target_id)) {
          // Define the media type bundle.
          $media_bundle = $vars["content"]["field_image"][0]["#media"]->bundle->target_id;
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
      if (!empty($vars["content"]["field_image"][0]["#media"])) {
        // Get the public path to the image.
        $image_public_uri = $vars["content"]["field_image"][0]["#media"]->field_media_image->entity->uri->value;
        // Define the image attributes for use in the template.
        $vars["image_alt"] = $vars["content"]["field_image"][0]["#media"]->field_media_image->alt;
        $vars["image_width"] = $vars["content"]["field_image"][0]["#media"]->field_media_image->width;
        $vars["image_height"] = $vars["content"]["field_image"][0]["#media"]->field_media_image->height;
        // Define the image path using sf_hero_banner.
        // Other image styles can bet set for this as needed.
        $vars["image_style_hero"] = ImageStyle::load('max_2600x2600')
          ->buildUrl($image_public_uri);
      }
    }

    // Hero bundle.
    if ($paragraph_bundle === 'hero') {
      // Check for the field_remove_btm_margin boolean value.
      if ($paragraph->hasField('field_remove_btm_margin') &&
        !$paragraph->get('field_remove_btm_margin')->isEmpty()) {
        // if the value is true...
        if ($paragraph->get('field_remove_btm_margin')->value === '1') {
          // Add a class if the margin is to be removed.
          $vars['attributes']['class'][] = 'remove-bottom-margin';
        }
      }
    }

    if ($paragraph_bundle === 'columns') {
      // Check for the column count.
      if ($paragraph->hasField('field_column_count') &&
        !$paragraph->get('field_column_count')->isEmpty()) {
        $cols_items = $vars["elements"]["field_column_count"]["#items"];
        // Count the number of items in the array.
        $item_count = count($cols_items);
        // Add a class.
        $vars['attributes']['class'][] = 'column--count-' . $item_count;
      }
    }
  }
}
