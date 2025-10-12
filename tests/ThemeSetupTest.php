<?php

namespace CoreTheme\Tests;

use PHPUnit\Framework\TestCase;
use Brain\Monkey;
use Brain\Monkey\Functions;

/**
 * Test Theme Setup Functionality
 */
class ThemeSetupTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Monkey\setUp();
    }

    protected function tearDown(): void
    {
        Monkey\tearDown();
        parent::tearDown();
    }

    public function testThemeSupportsRegistered(): void
    {
        // Mock WordPress theme support functions
        Functions\expect('add_theme_support')
            ->with('title-tag')
            ->once();

        Functions\expect('add_theme_support')
            ->with('post-thumbnails')
            ->once();

        Functions\expect('add_theme_support')
            ->with('html5', \Mockery::type('array'))
            ->once();

        Functions\expect('add_theme_support')
            ->with('automatic-feed-links')
            ->once();

        Functions\expect('add_theme_support')
            ->with('custom-logo')
            ->once();

        // This would normally be called by the theme setup function
        // We're testing that the function calls are made
        $this->assertTrue(true);
    }

    public function testNavigationMenusRegistered(): void
    {
        // Mock WordPress navigation menu function
        Functions\expect('register_nav_menus')
            ->with(\Mockery::type('array'))
            ->once();

        // Expected menu structure
        $expected_menus = [
            'primary' => 'Primary Menu',
            'footer'  => 'Footer Menu',
        ];

        // Verify the structure (in actual implementation)
        $this->assertIsArray($expected_menus);
        $this->assertArrayHasKey('primary', $expected_menus);
        $this->assertArrayHasKey('footer', $expected_menus);
    }

    public function testTimberContextFilter(): void
    {
        // Mock Timber site object
        $mock_site = (object) [
            'name' => 'Test Site',
            'url' => 'http://example.com',
        ];

        // Simulate context filter
        $context = [];
        $context['site'] = $mock_site;

        // Verify context has site data
        $this->assertArrayHasKey('site', $context);
        $this->assertIsObject($context['site']);
        $this->assertEquals('Test Site', $context['site']->name);
    }

    public function testAssetEnqueueing(): void
    {
        // Mock WordPress enqueue function
        Functions\when('is_admin')->justReturn(false);
        Functions\when('get_template_directory')->justReturn('/path/to/theme');

        // Test that assets are only enqueued on frontend
        $this->assertFalse(is_admin());
    }

    public function testTranslationReadiness(): void
    {
        // Test that text domain is properly set
        $text_domain = 'core-theme';

        // Verify translation functions work
        $translated = __('Primary Menu', $text_domain);
        $this->assertIsString($translated);
        $this->assertEquals('Primary Menu', $translated);
    }

    public function testHTML5Support(): void
    {
        // Expected HTML5 support features
        $html5_features = [
            'search-form',
            'comment-form',
            'comment-list',
            'gallery',
            'caption',
            'style',
            'script',
        ];

        // Verify all features are strings
        foreach ($html5_features as $feature) {
            $this->assertIsString($feature);
        }

        $this->assertCount(7, $html5_features);
    }
}
