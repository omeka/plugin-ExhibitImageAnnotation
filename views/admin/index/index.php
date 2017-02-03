<?php
// Note, cannot use file_image() becuase we need to append a fragment to the
// image src URL so Annotorious can uniquely identify the image on the page.
$imageUrl = $file->hasThumbnail()
    ? $file->getWebPath('fullsize')
    : img('fallback-file.png');
$imageId = 'image-annotation-' . $index;
$imageAttributes = array(
    'src' => $imageUrl . '#' . $imageId,
    'id' => $imageId,
    'class' => 'image-annotation-image',
);
echo sprintf('<img %s>', tag_attributes($imageAttributes));
