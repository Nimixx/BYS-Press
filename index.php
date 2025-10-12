<?php
/**
 * The main template file
 */

$context = Timber::context();
$context['posts'] = Timber::get_posts();

Timber::render('pages/index.twig', $context);
