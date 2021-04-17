<?php

/**
 * @file
 * Block functions to support theming in the GBHI theme.
 */

use Drupal\block\Entity\Block;
use Drupal\image\Entity\ImageStyle;

/**
 * Implements hook_preprocess_HOOK().
 *
 * Pass block region value to content so this can be used in
 * accesio_theme_suggestions_menu_alter.
 */
function accesio_preprocess_block(&$vars) {
  if (isset($vars['elements']['#id'])) {
    $block = Block::load($vars['elements']['#id']);
    $region = $block->getRegion();
    $vars['content']['#attributes']['region'] = $region;
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
      $vars["image_style_hero"] = ImageStyle::load('max_2600x2600')->buildUrl($image_public_uri);
    }
  }
}

/**
 * Implements hook_theme_suggestions_HOOK_alter().
 */
function accesio_theme_suggestions_block_alter(array &$suggestions, array $vars) {
  // Provide suggestion for block templates by custom block type.
  if (!empty($vars['elements']['content']['#block_content'])) {
    $block = $vars['elements']['content']['#block_content'];
    // Add `block--BLOCK-TYPE.html.twig`.
    $suggestions[] = 'block__' . $block->bundle();
    $view_mode = $vars['elements']['#configuration']['view_mode'];
    if (!empty($view_mode)) {
      // Add `block--BLOCK-TYPE--VIEW-MODE.html.twig`.
      $suggestions[] = 'block__' . $block->bundle() . '__' . $view_mode;
    }
  }

  // Add theme suggestions to blocks based on region.
  if (!empty($vars['elements']['#id'])) {
    $block = Block::load($vars['elements']['#id']);
    $suggestions[] = 'block__' . $block->getRegion();
    $suggestions[] = 'block__' . $block->getRegion() . '__' . $vars['elements']['#id'];
  }
  return $suggestions;
}

/**
 * Implements hook_theme_suggestions_HOOK_alter().
 *
 * Provide region based menu suggestions.
 */
function accesio_theme_suggestions_menu_alter(&$suggestions, array $vars) {
  // Add theme suggestions to menus based on block region.
  if (isset($vars['attributes']['region'])) {
    $suggestion = 'menu__' . $vars['menu_name'] . '__region_' . $vars['attributes']['region'];
    $suggestion = str_replace('-', '_', $suggestion);
    $suggestions[] = $suggestion;
  }
}
