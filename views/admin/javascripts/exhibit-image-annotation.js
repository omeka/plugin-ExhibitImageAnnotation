jQuery(document).ready(function () {

    Omeka.ExhibitImageAnnotation = {

        /**
         * Remove the "Add Item" button from a block.
         *
         * Note that each image annotation block must only have one attachment.
         * There is no way to configure the exhibit builder to accommodate this,
         * so we're using this as a stopgap.
         *
         * @param object blockForm The div.block-form jQuery object.
         * @param bool checkAttachment Check that an attachment exists before
         *     removing the button? Set to false if there's a chance the
         *     attachment is added after calling this function (e.g. an AJAX
         *     race condition).
         */
        removeAddItemButton: function(blockForm, checkAttachment=true) {
            if (checkAttachment) {
                if (blockForm.find('div.attachment').length) {
                    blockForm.find('div.add-item').hide();
                }
            } else {
                blockForm.find('div.add-item').hide()
            }
        },

        /**
         * Reduce a set of blocks to contain only image annotation blocks.
         *
         * @param object blockForm
         * @return object
         */
        reduceToImageAnnotationBlock: function(blockForm) {
            return blockForm.has('input[name$="[layout]"][value="image-annotation"]');
        },

        /**
         * Load an annotatable image into a block.
         *
         * @param object blockForm The div.block-form jQuery object.
         * @param object attachment The div.attachment jQuery object.
         * @param array annotations An array of Annotorious annotations.
         */
        loadAnnotatableImage: function(blockForm, attachment, annotations) {
            var fileId = attachment.find('input[name$="[file_id]"]').val();
            // Note that a previous script sets imageAnnotationImageUrl.
            jQuery.post(imageAnnotationImageUrl, {fileId: fileId})
                .done(function(imageUrl) {
                    if (imageUrl) {
                        var container = blockForm.find('div.image-annotation-container');
                        var imageId = 'image-annotation-' + blockForm.data('blockIndex');
                        var image = new Image();
                        image.onload = function() {
                            if (!annotations.length) {
                                var annotationsInput = container.children('input.image-annotation-annotations');
                                annotations = JSON.parse(annotationsInput.val());
                            }
                            anno.makeAnnotatable(image);
                            jQuery.each(annotations, function() {
                                this.src = image.src;
                                anno.addAnnotation(this);
                            });
                        };
                        image.src = imageUrl + '#' + imageId;
                        image.id = imageId;
                        image.className = 'image-annotation-image';
                        container.append(image);
                    } else {
                        alert('Cannot load image. The selected file has no image.');
                    }
                }).fail(function(jqXHR) {
                    console.log(jqXHR);
                });
        },
    };

    // On page load, remove all "Add Item" buttons from image annotation blocks
    // if an attachement already exists.
    jQuery.each(Omeka.ExhibitImageAnnotation.reduceToImageAnnotationBlock(jQuery('div.block-form')), function() {
        Omeka.ExhibitImageAnnotation.removeAddItemButton(jQuery(this), true);
    });

    // Remove the "Add Item" button after applying an attachment.
    jQuery(document).on('click', '#apply-attachment', function(e) {
        var blockForm = jQuery('.image-annotation-block-targeted');
        blockForm.removeClass('image-annotation-block-targeted');
        Omeka.ExhibitImageAnnotation.removeAddItemButton(blockForm, false);
    });

    // Flag the targeted image annotation block when adding/editing an item.
    // Note that the exhibit builder sets an "item-target" class that we could
    // use, but it removes it before appending the attachment due to an AJAX
    // race condition.
    jQuery(document).on('click', 'div.add-item, span.edit-attachment', function(e) {
        var blockForm = jQuery(this).closest('div.block-form');
        if (Omeka.ExhibitImageAnnotation.reduceToImageAnnotationBlock(blockForm).length) {
            // First remove all targeted flags in case the user x'ed out of a
            // previous attachment modal.
            jQuery('div.block-form').removeClass('image-annotation-block-targeted');
            blockForm.addClass('image-annotation-block-targeted');
        }
    });

    // Load an annotatable image.
    jQuery(document).on('click', 'a.image-annotation-load-image', function(e) {
        e.preventDefault();
        var blockForm = jQuery(this).closest('div.block-form');
        var attachment = blockForm.find('div.attachment');
        if (attachment.length) {
            var container = blockForm.find('div.image-annotation-container');
            var annotations = [];
            var image = container.find('.image-annotation-image');
            if (image.length) {
                // Load annotations from and destroy an existing annotatable
                // image before loading another one.
                annotations = anno.getAnnotations(image.attr('src'));
                container.children('div.annotorious-annotationlayer').remove();
                anno.destroy(image.attr('src'));
            }
            Omeka.ExhibitImageAnnotation.loadAnnotatableImage(blockForm, attachment, annotations);
        } else {
            alert('Cannot load image. Please add an item and select a file above.');
        }
    });

    // Set the annotations for every loaded image in every image-annotation block.
    jQuery('#exhibit-page-form').on('submit', function(e) {
        jQuery('img.image-annotation-image').each(function() {
            var container = jQuery(this).closest('div.image-annotation-container');
            var annotationsInput = container.children('input.image-annotation-annotations');
            annotationsInput.val(JSON.stringify(anno.getAnnotations(this.src)));
        });
    });
});
