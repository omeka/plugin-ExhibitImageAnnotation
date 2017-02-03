jQuery(document).ready(function () {

    // Remove the add-item button from all image-annotation blocks.
    function removeAddItem() {
        var blocks = jQuery('input[name$="[layout]"][value="image-annotation"]').closest('div.block-form');
        blocks.each(function() {
            jQuery(this).find('div.add-item').hide();
        });
    }

    removeAddItem();
    jQuery(document).on('click', '#apply-attachment', function(e) {
        removeAddItem();
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
            console.log(src);
            console.log(annotation);
            var imageId = /[^#]*$/.exec(src)[0];
            var image = jQuery('#' + imageId);
            var container = image.closest('div.image-annotation-container');
            var annotationsInput = container.children('input.image-annotation-annotations');
            annotationsInput.val(JSON.stringify(annotation));
        });
    });
});
