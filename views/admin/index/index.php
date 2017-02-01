<?php
$uri = $file->hasThumbnail() ? $file->getWebPath('fullsize') : img('fallback-file.png');
$id = 'image-annotation-' . $index;
$attributes = array(
    'src' => $uri . '#' . $id,
    'id' => $id,
    'class' => 'image-annotation-image',
);
?>
<img <?php echo tag_attributes($attributes); ?>>
