<?php
$formStem = $block->getFormStem();
$options = $block->getOptions();
$annotations = '[]';
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
    <div class="image-annotation-container">
        <input type="hidden"
            class="image-annotation-annotations"
            name="<?php echo html_escape($formStem . '[options][image-annotation]'); ?>"
            value="<?php echo html_escape($annotations); ?>">
    </div>
</div>
