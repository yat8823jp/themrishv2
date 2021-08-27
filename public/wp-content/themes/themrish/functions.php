<?php
/**
 * init
 */

if ( ! isset( $content_width ) ) :
	$content_width = 1200;
endif;

$theme         = wp_get_theme();
$theme_version = $theme->get( 'Version' );

function readScript() {
	wp_enqueue_style(  'style',  get_stylesheet_uri(), array(), $theme_version );
	wp_enqueue_style(  'main',   get_template_directory_uri() . '/css/main.css', array(), '1.0.0' );
	wp_enqueue_script( 'bundle', get_template_directory_uri() . '/js/bundle.js', array( 'jquery' ), $theme_version, true );
}
add_action( 'wp_enqueue_scripts', 'readScript' );
