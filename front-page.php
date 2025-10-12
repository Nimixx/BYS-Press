<?php
/**
 * Front Page Template
 */

$context = Timber::context();
$context['theme_name'] = 'Core Theme';
$context['description'] = 'This is modern WordPress theme built with';
$context['tech_stack'] = ['PHP', 'Timber', 'Twig', 'Vite'];

Timber::render('pages/front-page.twig', $context);
