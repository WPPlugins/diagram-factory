<?php
/**
 * Base class for DGF Plugins
 *
 * This class should simplify the the creation of new diagram factory packages.
 *
 * @version 1.1
 */
 
if(!defined('ABSPATH')) exit; // Exit if accessed directly

if(!class_exists('DGF_Base_Plugin')) :

class DGF_Base_Plugin {
	
	protected $store_url;
	protected $item_name;
	protected $licensed;
	protected $item_shortname;
	protected $plugin_slug;
			
    public function __construct($product_info) {
		$this->store_url = $product_info['store_url'];
		$this->item_name = $product_info['item_name'];
		$this->licensed = $product_info['licensed'];
		$this->item_shortname = 'dgf_' . str_replace(' ', '_', strtolower($product_info['item_name']));		 
		$this->plugin_slug = str_replace(' ', '-', strtolower($product_info['item_name']));
    }
        
    public function init() {
        add_action('admin_init', array($this, 'is_diagram_factory_plugin_active'));
        add_action('admin_menu', array($this, 'add_settings_menu'));
        						
		if($this->licensed) {
			add_action('admin_init', array($this, 'add_settings_licenses'));
			add_action('admin_menu', array($this, 'add_settings_licenses_submenu'));
		}		
	}
	
	function is_diagram_factory_plugin_active() {
		if (!is_plugin_active('diagram-factory/WP-DGF.php')) {
			add_action('admin_notices', array($this, 'diagram_factory_plugin_not_active_admin_notice'));
		}
	}
		
	function diagram_factory_plugin_not_active_admin_notice() {
		?>
		<div class="error">
			<p><?php _e($this->item_name . ': <strong>Diagram Factory</strong> plugin is <strong>not active</strong>. Install and activate it to display the diagrams.', 'dgf-text-domain' ); ?></p>
		</div>
		<?php
	}
				
	function add_settings_licenses() {
		add_settings_section(
			'dgf_settings_section_licenses',
			'License Settings',
			array($this, 'do_settings_section_licenses_callback'),
			'dgf_settings_licenses');
		
		add_settings_field(
			'dgf_setting_license_key_' . $this->item_shortname,
			$this->item_name,
			array($this, 'do_settings_field_license_key_callback'),
			'dgf_settings_licenses',
			'dgf_settings_section_licenses');
			
		register_setting('dgf_settings_licenses', $this->item_shortname . '_license_key');
	}
			
	function do_settings_section_licenses_callback() {
		$html = '<p>Except you got a plugin from the WordPress plugin directory, only plugins with an <strong>active license</strong> will receive updates.';
		$html .= '<ol>';
		$html .= '<li>Enter the license key (which you received at the download) into the corresponding field.</li>';
		$html .= '<li>Press \'Save Changes\'.</li>';
		$html .= '<li>Press \'Activate License\'.</li>';
		$html .= '</ol>';
		$html .= '<p>The license is now activated and you will receive the updates for the plugin.</p>';
		
		echo $html;
	}
				
	function do_settings_field_license_key_callback() {
		$license_key = get_option($this->item_shortname . '_license_key');
		$license_active = get_option($this->item_shortname . '_license_active');
		
		wp_nonce_field($this->item_shortname . '_license_key-nonce', $this->item_shortname . '_license_key-nonce');
		echo '<input type="text" class="regular-text" name="' . $this->item_shortname . '_license_key" id="' . $this->item_shortname . '_license_key" value="' . $license_key . '" />';

		if(false !== $license_key) {
			if($license_active->license == 'valid') {
				echo '<input type="submit" class="button-secondary" name="' . $this->item_shortname . '_license_key_deactivate" value="Deactivate License" />';
			}		
			if($license_active->license != 'valid') {
				echo '<input type="submit" class="button-secondary" name="' . $this->item_shortname . '_license_key_activate" value="Activate License" />';
			}
		}
	}
			
	function settings_licenses_page() {
	?>
        <div class="wrap">             	
			<form method="post" action="options.php">
				<?php
					//settings_errors();
					settings_fields('dgf_settings_licenses'); 
					do_settings_sections('dgf_settings_licenses');
					submit_button();
				?>
			</form>
		</div>
	<?php
	}
	
	function settings_home_page() {
		?>
		<div class="wrap">
			<?php screen_icon(); ?>
			
			<h2>Diagram Factory</h2>
						
			<h3>Quick Start</h3>
			
			<p>Go to a post or page and press the (new) button <span class="dashicons dashicons-chart-bar"></span> in the WordPress editor to <strong>create a diagram</strong>. Double click a diagram to edit.</p>
			<p>Visit the <a href="https://github.com/diagramfactory/dgf/wiki" target="_dgf">product wiki</a> for more information, tutorials and examples.</p>
			
			<h3>Diagram Factory Packages</h3>
			<p>With a <em>diagram factory package</em> you can add new functionality to the diagram factory environment.</p>
			<p>With a little programming experience, you can also create your own diagram factory packages. For example, your own color palettes, data readers, or diagram types.</p>
			
            <table>
            	<tr>      		
           			<td style="width:30%; padding:10px; text-align:center;">
           				<a href="<?php _e($this->store_url  . '/downloads/diagram-factory-scheme'); ?>" target="_dgf"><img src="<?php echo plugins_url('diagram-factory') . '/assets/diagram-factory-scheme-128x128-darkgrey.png' ?>" width="128">
            			<br/>Diagram Factory Scheme</a> <?php echo is_plugin_active('diagram-factory-scheme/WP-DGF.php') ? 
            				'<span style="color: green;">active</span>' : '<span style="color: darkgrey;">not active</span>' ?>
            			<p>A free diagram factory package containing additional color schemes and interpolaters.</p>
            		</td>
            		<td style="width:30%; padding:10px; text-align:center;">
            			<a href="<?php _e($this->store_url  . '/downloads/donate-to-diagram-factory'); ?>" target="_dgf"><img src="<?php echo plugins_url('diagram-factory') . '/assets/donate-to-diagram-factory-128x128-darkgrey.png' ?>" width="128">
            			<br/>Donate to Diagram Factory</a>
            			<p>Diagram Factory is an open-source project distributed free of charge and licensed under the GPL. Support it with a donation.<p>
            		</td>
            		<td style="width:30%; padding:10px; text-align:center;">&nbsp;</td>
            	</tr>
            </table>
            
            <p>Thank you for using Diagram Factory!</p>
		</div>
		<?php
	}

    /**
     * Add options page
     * see: http://melchoyce.github.io/dashicons/
     */	
	function add_settings_menu() {
		if(!$this->is_menu('dgf-settings'))
			add_menu_page(
				'Diagram Factory Settings', 
				'Diagram Factory', 
				'manage_options', 
				'dgf-settings',
				array($this, 'settings_home_page'),
				'dashicons-chart-bar', null
			);
	}
					
	function add_settings_licenses_submenu() {
		if(!$this->is_submenu('dgf-settings', 'dgf-settings-licenses'))
			add_submenu_page(
				'dgf-settings', 
				'License Settings', 
				'Licenses',
				'manage_options', 
				'dgf-settings-licenses', 
				array($this, 'settings_licenses_page')
			);
	}
	
	function is_menu($menu_slug) {
    	//error_log(', is_menu' . json_encode($GLOBALS['admin_page_hooks'], JSON_PRETTY_PRINT), 3, "/Users/thomy/Development/wp-errors.log");
    	return isset($GLOBALS['admin_page_hooks'][$menu_slug]);
	}
	
	function is_submenu($menu_slug, $sub_menu_slug) {
		global $submenu;
		return isset($submenu[$menu_slug]) && in_array($sub_menu_slug, wp_list_pluck( $submenu[$menu_slug], 2));
	}
}

endif; // end class_exists check
?>