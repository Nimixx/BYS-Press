<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme
 * and is used to display content when no more specific template matches
 *
 * @package CoreTheme
 * @since 1.0.0
 */

$context = Timber::context();
$context['posts'] = Timber::get_posts();

Timber::render('Index/Index.twig', $context);
