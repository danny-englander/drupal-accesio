<?php

/**
 * @file
 * Page functions to support theming in the Accesio theme.
 */

/**
 * Implements hook_library_info_alter().
 *
 * Unsets Drupal core's CSS files.
 *
 * @TODO: Workaround for https://www.drupal.org/node/2642122
 */
function accesio_library_info_alter(&$libraries, $extension) {
  if ($extension == 'system' && isset($libraries['base'])) {
    // unset($libraries['base']['css']['component']['css/components/ajax-progress.module.css']);
    unset($libraries['base']['css']['component']['css/components/align.module.css']);
    unset($libraries['base']['css']['component']['css/components/autocomplete-loading.module.css']);
    unset($libraries['base']['css']['component']['css/components/fieldgroup.module.css']);
    unset($libraries['base']['css']['component']['css/components/container-inline.module.css']);
    unset($libraries['base']['css']['component']['css/components/clearfix.module.css']);
    unset($libraries['base']['css']['component']['css/components/details.module.css']);
    # unset($libraries['base']['css']['component']['css/components/hidden.module.css']);
    unset($libraries['base']['css']['component']['css/components/item-list.module.css']);
    unset($libraries['base']['css']['component']['css/components/js.module.css']);
    unset($libraries['base']['css']['component']['css/components/nowrap.module.css']);
    unset($libraries['base']['css']['component']['css/components/position-container.module.css']);
    unset($libraries['base']['css']['component']['css/components/progress.module.css']);
    unset($libraries['base']['css']['component']['css/components/reset-appearance.module.css']);
    unset($libraries['base']['css']['component']['css/components/resize.module.css']);
    unset($libraries['base']['css']['component']['css/components/sticky-header.module.css']);
    unset($libraries['base']['css']['component']['css/components/system-status-counter.css']);
    unset($libraries['base']['css']['component']['css/components/system-status-report-counters.css']);
    unset($libraries['base']['css']['component']['css/components/system-status-report-general-info.css']);
    unset($libraries['base']['css']['component']['css/components/tabledrag.module.css']);
    unset($libraries['base']['css']['component']['css/components/tablesort.module.css']);
    unset($libraries['base']['css']['component']['css/components/tree-child.module.css']);
  }
}
