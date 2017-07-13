=== Diagram Factory ===
Contributors: ipublia, thmufl
Donate link: https://ipublia.com/downloads/dgf-donate/
Tags: diagram, chart, tinymce, graph, editor
Requires at least: 3.9
Tested up to: 4.8
Stable tag: 0.9.8
License: GPL3 or later
License URI: http://www.gnu.org/licenses/gpl-3.0

The easy way to add diagrams to your WordPress posts and pages.

== Description ==

Add beautiful diagrams (charts) to your WordPress post and pages.

= Easy handling =

Diagram Factory is fully integrated with the WordPress TinyMCE editor. You will be able to create your first data diagrams immediately.

= Combines the Strengths D3, TinyMCE and WordPress =

Diagram Factory is based on D3 (Data-Driven-Documents) and TinyMCE. New templates can be easily integrated into the framework.

= Responsive Design =

With the Diagram Factory you can influence exactly how your diagrams will look on different platforms (smartphones, tablets, desktops, etc.).

= Adapts to your needs =

Diagram Factory gives you many possibilities to design data diagrams according to your ideas. You will create expressive data diagrams in a short time.

= Layered approach =

Diagram Factory has a layered approach. Different diagram types can be combined with each other. This gives a great deal of flexibility in the design of your data visualization.

= Hosted on Github and tested on many platforms =

The Diagram Factory documentation and source code are hosted on [Github](https://github.com/diagramfactory). Diagram Factory is constantly tested and runs in all common environments. Visit the Diagram Factory [Wiki](https://github.com/diagramfactory/dgf/wiki) for a detailed list.

= Product Homepage =

On the [Product Homepage](https://dgfjs.org) you will find a [Gallery](https://dgfjs.org/gallery) with sample applications and [Tutorials](https://dgfjs.org/tutorials).

== Installation ==

1. Install and activate the plugin through the 'Plugins' menu in WordPress
2. Optional: Define your custom setups in the 'Diagram Factory' menu in WordPress

== Frequently Asked Questions ==

= In which environments was the software tested? =

Diagram Factory is constantly tested and runs in all common environments. Visit the [DGF Wiki](https://github.com/diagramfactory/dgf/wiki) for a detailed list.

= Where can I try the software? =

You can work with a live installation of the editor in the Diagram Factory [Tutorials](https://dgfjs.org/tutorials). Select the '101' and create your first diagram.

= The "bubble diagram" setup is not displayed. What do I have to do? =

Add the setup "dgf.setupHierarchic", then it should be displayed.

== Screenshots ==

1. Diagram Factory Responsive Design Example.

2. Donut Diagramm: The labels are automatically repositioned when data is updated. On mouse over (or tap on touch devices) the message below this caption shows the values of the data point.

3. Bubble Diagram: The size of the bubbles represents the running distance. The (interpolated) color the average speed.

4. Scatter Diagram with Labels: The size of the data points shows distance x speed.
On mouse over (or tap on touch devices) the message below this caption shows the values of the data point.

5. Two Bars Comparison: Compare two data series (e.g., old / new).

6. Bar Diagram: On mouse over (or tap on touch devices) the message below this caption shows the values of the data point.

7. Line Diagram: The data points of the line are maked with dots. On mouse over (or tap on touch devices) the message below this caption shows the values of the data point.

8. Line Diagram with Natural Curve: The line forms a natural curve between the data points.

9. Bar Diagram with Background Image: It is easy to set a background image to a diagram.

10. Bar Diagram with a Threshold Color Scale.

11. Line diagram with two data series: This setup uses two line diagrams on different layers one above the other.

12. Diagram Factory adds a button to the TinyMCE editor (red). Press the button to create a diagram or edit an existing one.

== Changelog ==

= 0.9.8 =

* Enhanced layer handling (z-index, transformations).
* Added legends for ordinal, threshold and sequential scales.
* Added setup for chromatic scales (dgf.setupD3ScaleChromatic).
* Fixes

= 0.9.6 =

* Added bubble diagrams.
* Fixes

= 0.9.5 =

* Fixed setup errors (y1 scale).

= 0.9.4 =

* Added pie and donut diagram.

= 0.9.2 =

* Fixed problems when deleting layers.
* Added "two bars compare" setup.

= 0.9.1 =

* Added automatic mapping from axis labels to data keys.
* Fixed dsv reader problems with tabs.

= 0.9.0 =

* Added a 'responsive css' style. With this, you can control the behavior on different devices.
* The inconsistent behavior when creating new diagrams has been solved.
* Added the html code to setup tab. You can copy this directly into your webpage to display the diagram.

= 0.8.6 =

* Fixed caching problem of readers.

= 0.8.5 =

* Added scatter diagram setup.

= 0.8.4 =

* Added gallery setup (dgf.setupGallery).

= 0.8.3 =

* Fixed problems with admin menu position.

= 0.8.2 =

* Initial release on wordpress.org

== Upgrade Notice ==

= 0.9.8 =

* Enhanced layer handling (z-index, transformations).
* Added legends for ordinal, threshold and sequential scales.
* Added setup for chromatic scales (add "dgf.setupD3ScaleChromatic" to enable it with already existing setups).
* Fixes

= 0.9.6 =

* Added bubble diagrams (add "dgf.setupHierarchic" to enable it with already existing setups).
* Fixes

= 0.9.5 =

* Fixed setup errors (y1 scale).

= 0.9.4 =

* Added pie and donut diagram.

= 0.9.2 =

* Fixed problems when deleting layers.
* Added "two bars compare" setup.

= 0.9.1 =

* Added automatic mapping from axis labels to data keys.
* Fixed dsv reader problems with tabs.

= 0.9.0 =

* This release has made substantial improvements in the responsive design of the diagrams on smartphones, tablets and desktops.
* We added a 'responsive css' style. With this, you can control the behavior on different devices.
* The inconsistent behavior when creating new diagrams has been solved.
* We added the html code to setup tab. You can copy this directly into your webpage to display the diagram.

= 0.8.6 =

* Fixed caching problem of readers.

= 0.8.5 =

* Added scatter diagram setup.
* Trim reader dsv input.

= 0.8.4 =

* Added gallery setup (add "dgf.setupGallery" to enable it with already existing setups).

= 0.8.3 =

* Fixed problems with admin menu position.
* New product page on dgfjs.org.

= 0.8.2 =

* Enhanced support for mobile phones and tablets.
* Fix for Internet Explorer.

