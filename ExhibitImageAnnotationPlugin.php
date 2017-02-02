<?php
class ExhibitImageAnnotationPlugin extends Omeka_Plugin_AbstractPlugin
{
    protected $_hooks = array('admin_head', 'public_head');
    protected $_filters = array('exhibit_layouts');

    public function hookAdminHead()
    {
        queue_css_file('annotorious-0.6.4/css/annotorious', 'all', false, 'javascripts');
        queue_js_file('annotorious-0.6.4/annotorious.min');
        queue_js_file('exhibit-image-annotation');
        queue_js_string('var imageAnnotationUrl = ' . json_encode(url('exhibit-image-annotation/index')));
    }

    public function hookPublicHead()
    {
        queue_css_file('annotorious-0.6.4/css/annotorious', 'all', false, 'javascripts');
        queue_js_file('annotorious-0.6.4/annotorious.min');
        queue_js_file('exhibit-image-annotation');
    }

    public function filterExhibitLayouts($layouts) {
        $layouts['image-annotation'] = array(
            'name' => 'Image Annotation',
            'description' => 'Layout featuring annotatable images'
        );
        return $layouts;
    }
}
