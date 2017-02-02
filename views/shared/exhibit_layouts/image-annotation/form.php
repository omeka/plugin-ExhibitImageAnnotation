<?php
$formStem = $block->getFormStem();
$options = $block->getOptions();
$annotations = null;
if (isset($options['image-annotation'])) {
    $annotations = $options['image-annotation'];
}
?>
<div class="selected-items">
    <h4><?php echo __('Item'); ?></h4>
    <?php echo $this->exhibitFormAttachments($block); ?>
</div>

<div class="layout-options">
    <div class="block-header">
        <h4><?php echo __('Annotate Image'); ?></h4>
        <div class="drawer image-annotation-drawer"></div>
    </div>
    <div class="image-annotation-container"
        data-form-stem="<?php echo html_escape($formStem); ?>"
        data-image-annotations="<?php echo html_escape(json_encode($annotations)); ?>"></div>
</div>
