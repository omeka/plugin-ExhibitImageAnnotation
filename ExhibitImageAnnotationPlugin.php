<?php
class ExhibitImageAnnotationPlugin extends Omeka_Plugin_AbstractPlugin
{
    protected $_hooks = array('admin_head', 'public_head', 'html_purifier_form_submission');
    protected $_filters = array('exhibit_layouts');

    public function hookAdminHead()
    {
        queue_css_file('exhibit-image-annotation');
        queue_css_file('annotorious-0.6.4/css/annotorious', 'all', false, 'javascripts');
        queue_js_file('annotorious-0.6.4/annotorious.min');
        queue_js_file('exhibit-image-annotation');
        queue_js_string('var imageAnnotationImageUrl = ' . json_encode(url('exhibit-image-annotation/index/image-url')));
    }

    public function hookPublicHead()
    {
        queue_css_file('exhibit-image-annotation');
        queue_css_file('annotorious-0.6.4/css/annotorious', 'all', false, 'javascripts');
        queue_js_file('annotorious-0.6.4/annotorious.min');
        queue_js_file('exhibit-image-annotation');
    }

    /**
     * Purify HTML posted in annotation text.
     *
     * @param array $args
     */
    public function hookHtmlPurifierFormSubmission($args)
    {
        $request = Zend_Controller_Front::getInstance()->getRequest();
        if ('exhibit-builder' !== $request->getModuleName()
            || 'exhibits' !== $request->getControllerName()
            || !in_array($request->getActionName(), array('add-page', 'edit-page'))
        ) {
            return;
        }
        $post = $request->getPost();
        if (!isset($post['blocks'])) {
            return;
        }
        foreach ($post['blocks'] as &$block) {
            if ('image-annotation' !== $block['layout']) {
                continue;
            }
            // Note that we lose some floating point precision when decoding
            // the annotation's shape geometry, but not enough to be noticeable.
            $annotations = json_decode($block['options']['image-annotation'], true);
            foreach ($annotations as &$annotation) {
                $annotation['text'] = $args['purifier']->purify($annotation['text']);
                // We must cast the annotation's style to an empty JSON object
                // or the annotation boxes will not style correctly.
                $annotation['shapes'][0]['style'] = new stdclass;
            }
            $block['options']['image-annotation'] = json_encode($annotations);
        }
        $request->setPost($post);
    }

    public function filterExhibitLayouts($layouts) {
        $layouts['image-annotation'] = array(
            'name' => 'Image Annotation',
            'description' => 'Layout featuring annotatable images'
        );
        return $layouts;
    }
}
