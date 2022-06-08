<?php

/**
 * Plugin Name:       Weather Information
 * Plugin URI:        https://www.knowwake.com/
 * Description:       This is a short description of what the plugin does. It's displayed in the WordPress admin area.
 * Version:           1.0.0
 * Author:            MD Samsozzaman Palash
 * Author URI:        #
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       weather-information
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'WEATHER_INFORMATION_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-weather-information-activator.php
 */
function activate_weather_information() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-weather-information-activator.php';
	Weather_Information_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-weather-information-deactivator.php
 */
function deactivate_weather_information() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-weather-information-deactivator.php';
	Weather_Information_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_weather_information' );
register_deactivation_hook( __FILE__, 'deactivate_weather_information' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-weather-information.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_weather_information() {

	$plugin = new Weather_Information();
	$plugin->run();

}
run_weather_information();
