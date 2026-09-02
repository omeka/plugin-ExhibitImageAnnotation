<?php
$annotations = $options['image-annotation'] ?? '[]';
$position = $options['file-position'] ?? 'left';
$captionPosition = $options['captions-position'] ?? 'center';
?>
<div class="exhibit-items fullsize <?php echo html_escape($position); ?> captions-<?php echo html_escape($captionPosition); ?>">
    <?php foreach ($attachments as $attachment): ?>
        <?php
        // Note, cannot use $this->exhibitAttachment() or file_image() becuase
        // we need to append a fragment to the image src URL so Annotorious can
        // uniquely identify the image on the page.
        $file = $attachment->getFile();
        if (!$file) {
            continue;
        }
        $imageUrl = $file->hasThumbnail()
            ? $file->getWebPath('fullsize')
            : img('fallback-file.png');
        $imageId = 'image-annotation-' . $attachment->id;
        $imageAltText = $file->getAltText() ?? '';
        $imageAttributes = [
            'src' => $imageUrl . '#' . $imageId,
            'id' => $imageId,
            'class' => 'image-annotation-image',
            'data-image-annotations' => $annotations,
            'alt' => $imageAltText
        ];
        $imageTag = sprintf('<img %s>', tag_attributes($imageAttributes));
        echo exhibit_builder_link_to_exhibit_item($imageTag, [], $file->getItem());
        echo $this->exhibitAttachmentCaption($attachment)
        ?>
    <?php endforeach; ?>
</div>
