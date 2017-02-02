<?php
$annotations = null;
if (isset($options['image-annotation'])) {
    $annotations = $options['image-annotation'];
}
?>
<div class="exhibit-items left fullsize captions-center">
    <?php foreach ($attachments as $attachment): ?>
        <?php
        $file = $attachment->getFile();
        $uri = $file->hasThumbnail() ? $file->getWebPath('fullsize') : img('fallback-file.png');
        $id = 'image-annotation-' . $attachment->id;
        $attributes = array(
            'src' => $uri . '#' . $id,
            'id' => $id,
            'class' => 'image-annotation-image',
            'data-image-annotations' => json_encode($annotations),
        );
        ?>
        <img <?php echo tag_attributes($attributes); ?>>
    <?php endforeach; ?>
</div>
