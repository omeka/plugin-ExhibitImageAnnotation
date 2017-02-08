<?php
class ExhibitImageAnnotation_IndexController extends Omeka_Controller_AbstractActionController
{
    public function imageUrlAction()
    {
        if (!$this->getRequest()->isXmlHttpRequest()) {
            return $this->_forward('not-found', 'error');
        }
        $file = get_record_by_id('File', $this->_getParam('fileId'));
        $imageUrl = $file->hasThumbnail()
            ? $file->getWebPath('fullsize')
            : img('fallback-file.png');
        $this->_helper->json($imageUrl);
    }
}
