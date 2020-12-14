<?php

/**
 * @file
 * Functions to support theming in the Accesio theme.
 */

use Drupal\image\Entity\ImageStyle;

/**
 * Prepares variables for media templates.
 */
function accesio_preprocess_media(array &$vars) {
  // Get the video URL.
  if (isset($vars["content"]["field_media_oembed_video"]["#items"]->value)) {
    // Template variable for the video URL.
    $vars['video_url'] = $vars["content"]["field_media_oembed_video"]["#items"]->value;
    // Video URL.
    $video_url = $vars["content"]["field_media_oembed_video"]["#items"]->value;
    $a = 1;

    // Test to see which vido provider is being rendered.
    if (strpos($video_url, 'vimeo') !== FALSE) {
      $vars['is_vimeo'] = TRUE;
    }
    if (strpos($video_url, 'youtube') !== FALSE) {
      $vars['is_youtube'] = TRUE;
    }
  }

  // Get the URI of the video thumbnail.
  if (isset($vars["content"]["thumbnail"][0]["#item"]->entity->uri->value)) {
    $video_thumbnail = $vars["content"]["thumbnail"][0]["#item"]->entity->uri->value;
    // e.g. //public://oembed_thumbnails/1irACl2SgCMDFsCMTxQanrNYX9U_maUSo4UVjCqG0lM.jpg.
    // Convert to an image style URL.
    $vars['video_thumbnail_image'] = ImageStyle::load('max_2600x2600')
      ->buildUrl($video_thumbnail);
  }

  // Check for the start time and create a variable.
  if (!empty($vars["content"]["field_start_time"][0]["#markup"])) {
    $vars['start_time'] = $vars["content"]["field_start_time"][0]["#markup"];
  }
  else {
    $vars['start_time'] = '0';
  }
}
