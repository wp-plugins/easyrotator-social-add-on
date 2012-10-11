=== EasyRotator Social Add-On ===
Contributors: DWUser.com
Donate link: http://www.dwuser.com/easyrotator/wordpress/
Tags: easyrotator, social, sharing, twitter, facebook, pinterest
Requires at least: 2.8
Tested up to: 3.4.2
Stable tag: 1.0.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Enhance EasyRotator for WordPress functionality with automatic social sharing buttons for each photo in your rotators.

== Description ==

**Please note: This plugin requires [EasyRotator for WordPress](http://wordpress.org/extend/plugins/easyrotator-for-wordpress/).**

This plugin enhances the functionality of EasyRotator for WordPress by making social sharing buttons automatically appear when hovering over any photo in a rotator.

**Requirements:** 

* You must be using [EasyRotator for WordPress](http://wordpress.org/extend/plugins/easyrotator-for-wordpress/)

**Important Links:**

* [Detailed Help](http://www.dwuser.com/support/easyrotator/wordpress/)
* [EasyRotator Homepage / Samples](http://www.dwuser.com/easyrotator/)

_EasyRotator is a registered trademark of Magnetic Marketing Corp dba DWUser.com._

== Installation ==

1. Upload the `easyrotator-social-addon` folder and all of its contents into your plugins directory (`/wp-content/plugins/` by default)
1. Open the WordPress admin panel and go to the 'Plugins' page
1. Activate the new 'EasyRotator Social Add-On' item in the list of plugins

**To enable social sharing for a single rotator:**

Locate the EasyRotator shortcode in the post or page editor; for example:

`[easyrotator]erc_00_xxxxxxx[/easyrotator]`

Add `social="true"` as a shortcode parameter:

`[easyrotator social="true"]erc_00_xxxxxxx[/easyrotator]`

**To enable social sharing for all rotators:**

Use the plugin editor to edit this line in the easyrotator-social-addon.php file:

`const APPLY_TO_ALL_ROTATORS = false;`

Change the value to `true`:

`const APPLY_TO_ALL_ROTATORS = true;`

== Frequently Asked Questions ==

= I'm having trouble getting started with EasyRotator for WordPress or the Social Add-On; what can I do? =

Please see the detailed installation and usage instructions [on our website](http://www.dwuser.com/support/easyrotator/wordpress/).  If you can't find the answer there, we offer responsive complimentary support.

== Screenshots ==
1. A rotator with social sharing buttons enabled

== Changelog ==

= 1.0.0 =
* First release