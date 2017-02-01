<?php
class ExhibitImageAnnotation_IndexController extends Omeka_Controller_AbstractActionController
{
    public function indexAction()
    {
        $this->view->file = get_record_by_id('File', $this->_getParam('fileId'));
        $this->view->index = $this->_getParam('index');
    }
}
