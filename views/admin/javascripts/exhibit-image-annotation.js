jQuery(document).ready(function () {

    /**
     * Remove the "Add Item" button from a block.
     *
     * Note that each image annotation block must only have one attachment.
     * There is no way to configure the exhibit builder to accommodate this, so
     * we're using this as a stopgap.
     *
     * @param object blockForm The div.block-form jQuery object.
     * @param bool checkAttachment Check that an attachment exists before
     *     removing the button? Set to false if there's a chance the attachment
     *     is added after calling this function (e.g. an AJAX race condition).
     */
    function removeAddItemButton(blockForm, checkAttachment=true) {
        if (checkAttachment) {
            var attachment = blockForm.find('div.attachment');
            if (1 == attachment.length) {
                blockForm.find('div.add-item').hide();
            }
        } else {
            blockForm.find('div.add-item').hide()
        }
    }

    /**
     * Reduce a set of blocks to contain only image annotation blocks.
     *
     * @param object blockForm
     * @return object
     */
    function reduceToImageAnnotationBlock(blockForm) {
        return blockForm.has('input[name$="[layout]"][value="image-annotation"]');
    }

    // On page load, remove all "Add Item" buttons from image annotation blocks
    // if an attachement already exists.
    jQuery.each(reduceToImageAnnotationBlock(jQuery('div.block-form')), function() {
        removeAddItemButton(jQuery(this), true);
    });

    // Remove the "Add Item" button after applying an attachment.
    jQuery(document).on('click', '#apply-attachment', function(e) {
        var blockForm = jQuery('.image-annotation-block-targeted');
        blockForm.removeClass('image-annotation-block-targeted');
        removeAddItemButton(blockForm, false);
    });

    // Flag the targeted image annotation block when adding/editing an item.
    // Note that the exhibit builder sets an "item-target" class that we could
    // use, but it removes it before appending the attachment due to an AJAX
    // race condition.
    jQuery(document).on('click', 'div.add-item, span.edit-attachment', function(e) {
        var blockForm = jQuery(this).closest('div.block-form');
        if (reduceToImageAnnotationBlock(blockForm).length) {
            // First remove all targeted flags in case the user x'ed out of a
            // previous attachment modal.
            jQuery('div.block-form').removeClass('image-annotation-block-targeted');
            blockForm.addClass('image-annotation-block-targeted');
        }
    });

    // Load an annotatable image.
    jQuery(document).on('click', 'div.image-annotation-drawer', function(e) {
        var drawer = jQuery(this);
        var blockForm = drawer.closest('div.block-form');
        var attachment = blockForm.find('div.attachment');

        // Conditionally load the image.
        if (0 == attachment.length // There must be an attachment
            || !drawer.hasClass('opened') // The drawer must be closed
            || drawer.hasClass('image-annotation-loaded') // The image must not already be loaded
        ) {
            return;
        }

        var fileId = attachment.find('input[name$="[file_id]"]').val();
        // Note that a previous script sets imageAnnotationUrl.
        jQuery.post(imageAnnotationUrl, {fileId: fileId, index: blockForm.data('blockIndex')})
            .done(function(data) {
                var container = blockForm.find('div.image-annotation-container');
                var image = jQuery.parseHTML(data)[0];
                container.append(image);
                image.onload = function() {
                    anno.makeAnnotatable(image);
                    var imageSrc = jQuery(image).attr('src');
                    var annotationsInput = container.children('input.image-annotation-annotations');
                    var annotations = JSON.parse(annotationsInput.val());
                    jQuery.each(annotations, function() {
                        this.src = imageSrc;
                        anno.addAnnotation(this);
                    });
                    drawer.addClass('image-annotation-loaded');
                };
            })
            .fail(function(jqXHR) {
                console.log(jqXHR);
            });
    });

    // Set the annotations for every image-annotation block.
    jQuery('#exhibit-page-form').on('submit', function(e) {
        var annotations = {};
        jQuery.each(anno.getAnnotations(), function() {
            if (!annotations.hasOwnProperty(this.src)) {
                annotations[this.src] = [];
            }
            annotations[this.src].push({text: this.text, shapes: this.shapes});
        });
        jQuery.each(annotations, function(src, annotation) {
            var imageId = /[^#]*$/.exec(src)[0];
            var image = jQuery('#' + imageId);
            var container = image.closest('div.image-annotation-container');
            var annotationsInput = container.children('input.image-annotation-annotations');
            annotationsInput.val(JSON.stringify(annotation));
        });
    });
});
