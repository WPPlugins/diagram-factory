<?php
/**
 * Plugin Name: Diagram Factory
 * Plugin URI: https://dgfjs.org
 * Description: The easy way to add diagrams to your posts and pages.
 * Version: 0.9.8
 * Author: ipublia <developer@ipublia.com>
 * Author URI: https://ipublia.com
 * License: LGPL-3.0
 */
 
defined('ABSPATH') or die('No script kiddies please!');

if(!class_exists('DGF_Base_Plugin')) {
	include(dirname(__FILE__) . '/wp-include/DGF_Base_Plugin.php');
}

class Diagram_Factory_Plugin extends DGF_Base_Plugin {

	public function init() {		
		parent::init();
				
		// Add custom scripts
		add_action('admin_enqueue_scripts', array($this, 'add_custom_scripts'));
        add_action('wp_enqueue_scripts', array($this, 'add_custom_scripts'));
        
		// Add custom styles
		add_action('admin_enqueue_scripts', array($this, 'add_custom_styles'));
        add_action('wp_enqueue_scripts', array($this, 'add_custom_styles'));
           
        add_action('init', array($this, 'register_mce_hooks'));
                
		add_action('admin_head', array($this, 'add_tag_factory_script'));
		add_action('wp_head', array($this, 'add_tag_factory_script'));

		add_action('admin_menu', array($this, 'add_settings_editor_submenu'));
		add_action('admin_init', array($this, 'add_settings_editor'));
		
		// Allow data-dgf on html figures for authors and contributors
		add_filter('wp_kses_allowed_html', array($this, 'ksesAllowHtmlFigureAttributes'), 100, 2);
	}
	
	function get_default_tag_factory_setup() {
		$json = '{'
				. '"setups": ['
				. '"dgf.setupD3",'
				. '"dgf.setupDGF",'
				. '"dgf.setupBasic",'
				. '"dgf.setupHierarchic",'
				. '"dgf.setupMultiSeries",'
				. '"dgf.setupTime",'
				. '"dgf.setupD3ScaleChromatic"'
				. '],'
				. '"setup_urls": [],'
				. '"setup_json": {}'
				. '}';
				
		return json_encode(json_decode($json), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
	}
	
	function ksesAllowHtmlFigureAttributes($data, $context){
		if ($context === 'post' || $context === 'page'){
			$allowedFigureAttributes = array(
				'data-mce-selected' => true,
				'data-dgf' => true,
				'contenteditable' => true
			);
			$data['figure'] = array_merge($data['figure'], $allowedFigureAttributes);
			
			$allowedFigcaptionAttributes = array(
				'contenteditable' => true
			);
			$data['figcaption'] = array_merge($data['figcaption'], $allowedFigcaptionAttributes);
		}
		return $data;
	}
	
	function add_tag_factory_script() {		
		echo '<script>dgf.init('
			. preg_replace('/\s+/S', " ", get_option('dgf_tag_factory_setup', $this->get_default_tag_factory_setup()))
			. ');</script>';
	}

	function add_custom_scripts() {		
		wp_register_script('d3-script', 'https://d3js.org/d3.v4.min.js');
		wp_enqueue_script('d3-script');
		
		wp_register_script('dgf-script', plugins_url('lib/', __FILE__) . 'dgf.min.js', array('d3-script'));
		wp_enqueue_script('dgf-script');
	}

	function add_custom_styles() {
		wp_register_style('dgf-default-style', plugins_url('style/', __FILE__) . 'dgf.css');
		wp_enqueue_style('dgf-default-style');
	}
	
	function register_mce_hooks() {
		if((current_user_can('edit_posts') || current_user_can('edit_pages')) && get_user_option('rich_editing')) {
			add_filter('mce_external_plugins', array($this, 'register_dgf_plugin'));
			add_filter('mce_buttons', array($this, 'register_dgf_button'));
			add_filter('mce_css', array($this, 'register_dgf_mce_css'));
		}
	}
	
	function register_dgf_plugin($mce_plugins) {
		$mce_plugins['dgf'] = plugins_url('lib/', __FILE__) . 'dgf-tinymce-plugin.min.js';
		return $mce_plugins;
	}

	function register_dgf_button($mce_buttons) {
		array_push($mce_buttons, '|', 'dgf');
		return $mce_buttons;
	}

	function register_dgf_mce_css($url) {
		if(!empty($url))
			$url .= ',';
	    $url .= plugins_url('style/', __FILE__) . 'dgf.css';
    	return $url;
	}
	
	function validate_dgf_tag_factory_setup($input) {
		$input = trim(wp_strip_all_tags($input));
		
		if(empty($input)) {
			delete_option('dgf_tag_factory_setup');
			$input = $this->get_default_tag_factory_setup();
		}
		
		$json = json_decode($input);
		if(json_last_error()) {
			add_settings_error(
				'dgf_settings_editor',
				esc_attr('settings_updated'),
				__('Can\'t read Tag Factory Setup: ' . json_last_error_msg(), 'my-text-domain'),
				'error'
			);
			return $input;
		}
		return json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
	}
	
	function add_settings_editor() {
	
		$section_group = 'dgf_settings_editor';
		$section_name = 'dgf_tag_factory_setup';
		
		register_setting($section_group, $section_name, array($this, 'validate_dgf_tag_factory_setup'));		
		
		$settings_section = 'dgf_settings_section_editor';
		$page = $section_group;
		
		add_settings_section(
			'dgf_settings_section_editor',
			'Editor Settings',
			array($this, 'do_settings_section_editor_callback'),
			$page);
			
		add_settings_field(
			'dgf_tag_factory_setup',
			'Tag Factory Setup',
			array($this, 'do_settings_field_tag_factory_setup_callback'),
			$page,
			$settings_section);
	}

	function do_settings_section_editor_callback() {
		$html =
			'<p>The <i>editor settings</i> define the behaviour of the editor and the subsequent rendering of the diagrams inside posts and pages. The <i>tag factory setup</i> defines the available setups. ' .
			'<strong>Do not delete setups</strong> that are already in use by diagrams as they can\'t be rendered subsequently.</p>' .
			'<p>Visit the <a href="https://dgfjs.org" target"_dgf">product wiki</a> for tutorials and examples.</p>';
		echo $html;
	}
			
	function do_settings_field_tag_factory_setup_callback() {
		wp_nonce_field($this->wp_nonce, $this->wp_nonce);
		
		$html = '<textarea name="dgf_tag_factory_setup" style="width: 100%;" rows="40"'
			. ' title="Tag factory setup in JSON. Visit the product wiki for more information.">'
			. get_option('dgf_tag_factory_setup', $this->get_default_tag_factory_setup())
			. '</textarea>';
			
		echo $html;
	}

	function do_settings_editor_page() {
	?>
        <div class="wrap">             	
			<form method="post" action="options.php">
				<?php
					settings_errors();
					settings_fields('dgf_settings_editor'); 
					do_settings_sections('dgf_settings_editor');
					submit_button();
				?>
			</form>
		</div>
	<?php
	}
					
	function add_settings_editor_submenu() {
		if(!$this->is_submenu('dgf-settings', 'dgf-settings-editor'))
			add_submenu_page(
				'dgf-settings', 
				'Editor Settings', 
				'Editor',
				'manage_options', 
				'dgf-settings-editor', 
				array($this, 'do_settings_editor_page')
			);
	}
}

$diagram_factory_product_info = array(
	'store_url' => 'https://www.ipublia.com',
	'item_name' => 'Diagram Factory',
	'licensed' => false,
	'version' => '0.9.8',
	'author' => 'Thomas Müller Flury',
	'license' => null
);

$diagram_factory_plugin = new Diagram_Factory_Plugin($diagram_factory_product_info);
$diagram_factory_plugin->init();

if($diagram_factory_product_info['licensed']) {

	if(!class_exists('DGF_License') ) {
		include(dirname(__FILE__) . '/wp-include/DGF_License.php');
	}
	
	$diagram_factory_license = new DGF_License(
		__FILE__,
		$diagram_factory_product_info['item_name'],
		$diagram_factory_product_info['version'],
		$diagram_factory_product_info['author'],
		null,
		$diagram_factory_product_info['store_url'],
		null);
}
?>
