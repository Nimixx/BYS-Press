<?php
/**
 * Front Page Template
 *
 * This template is used for the front page of the site
 *
 * @package BYSPress
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

use BYSPress\Components\Alert;

$context = Timber::context();
$context['theme_name'] = 'BYS Press';
$context['description'] = 'This is modern WordPress theme built with';
$context['tech_stack'] = ['PHP', 'Timber', 'Twig', 'Vite', 'TypeScript', 'CSS framework'];

Timber::render('FrontPage/FrontPage.twig', $context);
