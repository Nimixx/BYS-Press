<?php
/**
 * Front Page Template
 *
 * This template is used for the front page of the site
 *
 * @package CoreTheme
 * @since 1.0.0
 */

$context = Timber::context();
$context['theme_name'] = 'Core Theme';
$context['description'] = 'This is modern WordPress theme built with';
$context['tech_stack'] = ['PHP', 'Timber', 'Twig', 'Vite', 'Vue', 'TypeScript', 'CSS framework'];

Timber::render('FrontPage/FrontPage.twig', $context);
