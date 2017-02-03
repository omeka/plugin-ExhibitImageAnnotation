<?php
$annotations = isset($options['image-annotation'])
    ? $options['image-annotation'] : '[]';
$position = isset($options['file-position'])
    ? $options['file-position'] : 'left';
$captionPosition = isset($options['captions-position'])
    ? $options['captions-position'] : 'center';
?>
<div class="exhibit-items fullsize <?php echo html_escape($position); ?> captions-<?php echo html_escape($captionPosition); ?>">
    <?php foreach ($attachments as $attachment): ?>
        <?php
        // Note, cannot use $this->exhibitAttachment() or file_image() becuase
        // we need to append a fragment to the image src URL so Annotorious can
        // uniquely identify the image on the page.
        $file = $attachment->getFile();
        $imageUrl = $file->hasThumbnail()
            ? $file->getWebPath('fullsize')
            : img('fallback-file.png');
        $imageId = 'image-annotation-' . $attachment->id;
        $imageAttributes = array(
            'src' => $imageUrl . '#' . $imageId,
            'id' => $imageId,
            'class' => 'image-annotation-image',
            'data-image-annotations' => $annotations,
        );
        $imageTag = sprintf('<img %s>', tag_attributes($imageAttributes));
        echo link_to($file, 'show', $imageTag);
        echo $this->exhibitAttachmentCaption($attachment)
        ?>
    <?php endforeach; ?>
</div>
