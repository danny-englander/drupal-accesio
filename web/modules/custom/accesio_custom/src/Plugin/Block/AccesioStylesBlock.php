<?php

namespace Drupal\accesio_custom\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a custom glossary block.
 *
 * @Block(
 *   id = "accesio_styles",
 *   admin_label = @Translation("Custom block for accesio_styles")
 * )
 */
class AccesioStylesBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $build = [
      '#theme' => 'accesio_styles',
    ];

    return $build;
  }

}
