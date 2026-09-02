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

<div class="layout-options" role="group" aria-labelledby="<?php echo $formStem; ?>-annotate-image-label">
    <div class="block-header drawer">
        <h4 id="<?php echo $formStem; ?>-annotate-image-label"><?php echo __('Annotate Image'); ?></h4>
        <button class="drawer-toggle image-annotation-drawer" type="button" data-action-selector="opened" aria-expanded="false" aria-controls="<?php echo $formStem; ?>-layout-options" aria-label="<?php echo __('Show options'); ?>" title="<?php echo __('Show options'); ?>"><span class="icon"></span></button>
    </div>
    <div class=" drawer-contents" id="<?php echo $formStem; ?>-layout-options">
        <div class="image-annotation-container">
            <p><a href="#" class="image-annotation-load-image button"><?php echo __('Load selected image.'); ?></a></p>
            <input type="hidden"
                class="image-annotation-annotations"
                name="<?php echo html_escape($formStem . '[options][image-annotation]'); ?>"
                value="<?php echo html_escape($annotations); ?>">
        </div>
    </div>
</div>

<div class="layout-options" role="group" aria-labelledby="<?php echo $formStem; ?>-layout-options-label">
    <div class="block-header drawer">
        <h4 id="<?php echo $formStem; ?>-layout-options-label"><?php echo __('Layout Options'); ?></h4>
        <button class="drawer-toggle" type="button" data-action-selector="opened" aria-expanded="false" aria-controls="<?php echo $formStem; ?>-layout-options" aria-label="<?php echo __('Show options'); ?>" title="<?php echo __('Show options'); ?>"><span class="icon"></span></button>
    </div>
    <div class="drawer-contents" id="<?php echo $formStem; ?>-layout-options">
        <div class="file-position">
            <?php echo $this->formLabel(
                $formStem . '[options][file-position]',
                __('File position')
            ); ?>
            <?php
            echo $this->formSelect(
                $formStem . '[options][file-position]',
                $options['file-position'] ?? null,
                [],
                [
                    'left' => __('Left'),
                    'right' => __('Right'),
                    'center' => __('Center')
                ]
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
                $options['captions-position'] ?? null,
                [],
                [
                    'center' => __('Center'),
                    'left' => __('Left'),
                    'right' => __('Right')
                ]);
            ?>
        </div>
    </div>
</div>
