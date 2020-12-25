<?php

namespace Drupal\accesio_styles\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Class AccesioStylesController.
 */
class AccesioStylesController extends ControllerBase {

  /**
   * Go to main pattern library page.
   *
   * @inheritdoc
   */
  public function view() {

    return [
      '#theme' => 'accesio_styles',
    ];
  }

  /**
   * Route to theme file based on path.
   */
  public function subpage($path) {

    // This is a really quick way of creating a path for every
    // theme file we have
    // e.g. /pattern-library/atoms-colors will use
    // the atoms-colors.html.twig theme file.
    $path = str_replace('-', '_', $path);
    return [
      '#theme' => $path,
    ];

  }

}
