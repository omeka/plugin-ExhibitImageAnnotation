<?php
class ExhibitImageAnnotationPlugin extends Omeka_Plugin_AbstractPlugin
{
    protected $_hooks = array('admin_head');
    protected $_filters = array('exhibit_layouts');

    public function hookAdminHead()
    {
        //~ queue_css_url('http://annotorious.github.com/latest/annotorious.css');
        //~ queue_js_url('http://annotorious.github.com/latest/annotorious.min.js');
        queue_css_file('annotorious-0.6.4/css/annotorious', 'all', false, 'javascripts');
        queue_js_file('annotorious-0.6.4/annotorious.min');

        queue_js_string('var imageAnnotationUrl = ' . json_encode(url('exhibit-image-annotation/index')));
        queue_js_string(<<<JS
jQuery(document).ready(function () {

    // Remove the add-item button from all image-annotation blocks.
    function removeAddItem() {
        var imageAnnotationBlocks = jQuery('input[name$="[layout]"][value="image-annotation"]').closest('div.block-form');
        imageAnnotationBlocks.each(function() {
            jQuery(this).find('div.add-item').hide();
        });
    }

    removeAddItem();
    jQuery(document).on('click', '#apply-attachment', function(e) {
        removeAddItem();
    });

    // Load an annotatable image.
    jQuery(document).on('click', 'div.image-annotation-drawer', function(e) {
        var blockForm = jQuery(this).closest('div.block-form');
        var attachment = blockForm.find('div.attachment');
        var fileId = attachment.find('input[name$="[file_id]"]').val();
        jQuery.post(imageAnnotationUrl, {fileId: fileId})
            .done(function(data) {
                var container = blockForm.find('div.image-annotation-container');
                var image = jQuery.parseHTML(data)[0];
                container.append(image);
                image.onload = function() {
                    anno.makeAnnotatable(image)
                };
            })
            .fail(function(data) {
                console.log(data);
            });
    });

    // Set annotations as block data.
    anno.addHandler('onAnnotationCreated', function(annotation) {
        console.log(annotation);
    });
});
JS
);
    }

    public function filterExhibitLayouts($layouts) {
        $layouts['image-annotation'] = array(
            'name' => 'Image Annotation',
            'description' => 'Layout featuring annotatable images'
        );
        return $layouts;
    }
}
