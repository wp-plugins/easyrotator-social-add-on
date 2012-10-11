<?php
/*
Plugin Name: EasyRotator Social Add-On
Plugin URI: http://www.dwuser.com/easyrotator/wordpress/
Description: Add-on for EasyRotator for WordPress that enables social sharing of photos in rotators.
Version: 1.0.0
Author: DWUser.com
Author URI: http://www.dwuser.com/
License: GPL v2 or later
*/

/*
Copyright 2012 DWUser.com.
Email contact: support {at] dwuser.com

This file is part of EasyRotator Social Add-On.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

class EasyRotatorSocialAddOn
{
    // --- Config options ---
    const APPLY_TO_ALL_ROTATORS = false;

    // ---------------------------------

    function EasyRotatorSocialAddOn()
    {
        // --- Initialization ---

        // note that this automatically matches http/https.
        $this->url = dirname(plugins_url('easyrotator-social-addon.php', __FILE__)) . '/';


        // --- Register hooks ---

        // Shortcode filter (high priority)
        add_filter( 'init',             array( $this, 'hook_init_load_scripts' ) );
        add_filter( 'the_content',      array( $this, 'hook_filter_the_content' ) );

    }

    function hook_init_load_scripts()
    {
        wp_enqueue_script( 'easyrotator-social-addon', $this->url . 'js/easyrotator_social.js' );
    }

    function hook_filter_the_content($content)
    {
        if (strpos($content, '[easyrotator') !== false)
        {
            $pattern = '|(\[easyrotator [^\]]*social="true"[^\]]*\].*?\[/easyrotator\])|i';
            if (self::APPLY_TO_ALL_ROTATORS)
                $pattern = '|(\[easyrotator[^\]]*\].*?\[/easyrotator\])|i';
            $content = preg_replace($pattern, '<div class="socialEasyRotator">$1</div>', $content);
        }
        return $content;
    }
}

$easyrotator_social_addon = new EasyRotatorSocialAddOn();

?>