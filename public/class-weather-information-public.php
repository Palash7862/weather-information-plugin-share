<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       #
 * @since      1.0.0
 *
 * @package    Weather_Information
 * @subpackage Weather_Information/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Weather_Information
 * @subpackage Weather_Information/public
 * @author     MD Samsozzaman <samsozzaman.sp@gmail.com>
 */
class Weather_Information_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	public function enqueue_styles() {
		wp_enqueue_style( 'tailwind', 'https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/utilities.css', array(), $this->version, 'all' );
		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/weather-information-public.css', array('tailwind'), $this->version, 'all' );

	}

	public function enqueue_scripts() {
	    
	    wp_enqueue_script('google-map-js', 'https://maps.googleapis.com/maps/api/js?libraries=geometry,places&amp;key=AIzaSyAce4PURvrIzoqWWfZqe8P_wBl6OKA3Q7o', array(), $this->version, false );
	    wp_enqueue_script('moment-js', 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js', array(), $this->version, false );
	    wp_enqueue_script( 'chart-js-cdn', 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.1/Chart.min.js', array( 'jquery' ), $this->version, false );
        //wp_enqueue_script( 'chart-js-plugin-cdn', 'https://cdn.jsdelivr.net/gh/emn178/chartjs-plugin-labels/src/chartjs-plugin-labels.js', array( 'jquery' ), $this->version, false );
	    //wp_enqueue_script( 'chart-js-cdn', 'https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js', array( 'jquery' ), $this->version, false );
		wp_enqueue_script( 'vue-js-cdn', 'https://cdn.jsdelivr.net/npm/vue@2', array( 'jquery' ), $this->version, false );
		wp_enqueue_script( 'vuechart-js-cdn', 'https://unpkg.com/vue-chartjs/dist/vue-chartjs.min.js', array( 'vue-js-cdn', 'chart-js-cdn' ), $this->version, false );
		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/weather-information-public.js', array( 'jquery', 'vue-js-cdn', 'moment-js', 'chart-js-cdn', 'vuechart-js-cdn', 'google-map-js' ), $this->version, false );
	}


	public function weatherhomeshortcode_shortcode_function(){
		return '<div id="weather-widget-box"></div>';
	}

	public function weather_details_shortcode_function(){
		return '<div id="weather-details-box"></div>';
	}

}
