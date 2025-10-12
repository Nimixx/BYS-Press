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
$context['tech_stack'] = ['PHP', 'Timber', 'Twig', 'Vite', 'Svelte', 'TypeScript', 'CSS framework'];

Timber::render('pages/front-page.twig', $context);
