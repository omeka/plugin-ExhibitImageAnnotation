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
        <p><a href="#" class="image-annotation-load-image button"><?php echo __('Load selected image.'); ?></a></p>
        <input type="hidden"
            class="image-annotation-annotations"
            name="<?php echo html_escape($formStem . '[options][image-annotation]'); ?>"
            value="<?php echo html_escape($annotations); ?>">
    </div>
</div>

<div class="layout-options">
    <div class="block-header">
        <h4><?php echo __('Layout Options'); ?></h4>
        <div class="drawer"></div>
    </div>
    <div class="file-position">
        <?php echo $this->formLabel(
            $formStem . '[options][file-position]',
            __('File position')
        ); ?>
        <?php
        echo $this->formSelect(
            $formStem . '[options][file-position]',
            isset($options['file-position']) ? $options['file-position'] : null,
            array(),
            array(
                'left' => __('Left'),
                'right' => __('Right'),
                'center' => __('Center')
            )
        );
        ?>
    </div>
    <div class="captions-position">
        <?php echo $this->formLabel(
            $formStem . '[options][captions-position]',
            __('Captions position')
        ); ?>
        <?php
        echo $this->formSelect(
            $formStem . '[options][captions-position]',
            isset($options['captions-position']) ? $options['captions-position'] : null,
            array(),
            array(
                'center' => __('Center'),
                'left' => __('Left'),
                'right' => __('Right')
            ));
        ?>
    </div>
</div>
