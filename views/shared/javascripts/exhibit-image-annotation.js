jQuery(document).ready(function () {

    // Remove the add-item button from all image-annotation blocks.
    function removeAddItem() {
        var imageAnnotationBlocks = jQuery('input[name$="[layout]"][value="image-annotation"]').closest('div.block-form');
        imageAnnotationBlocks.each(function() {
            jQuery(this).find('div.add-item').hide();
        });
    }

    removeAddItem();
    jQuery(document).on('click', '#apply-attachment', function(e) {
        removeAddItem();
    });

    // Load an annotatable image.
    jQuery(document).on('click', 'div.image-annotation-drawer', function(e) {
        var blockForm = jQuery(this).closest('div.block-form');
        var attachment = blockForm.find('div.attachment');
        var fileId = attachment.find('input[name$="[file_id]"]').val();
        jQuery.post(imageAnnotationUrl, {fileId: fileId, index: blockForm.data('blockIndex')})
            .done(function(data) {
                var container = blockForm.find('div.image-annotation-container');
                var image = jQuery.parseHTML(data)[0];
                container.append(image);
                image.onload = function() {
                    anno.makeAnnotatable(image)
                };
            })
            .fail(function(data) {
                console.log(data);
            });
    });

    // Set the annotations for every image-annotation block.
    jQuery('#exhibit-page-form').on('submit', function(e) {
        jQuery.each(anno.getAnnotations(), function() {
            var imageId = /[^#]*$/.exec(this.src)[0];
            var image = jQuery('#' + imageId);
            var imageContainer = image.closest('div.image-annotation-container');
            jQuery('<input>')
                .attr('type', 'hidden')
                .attr('name', imageContainer.data('formStem') + '[options][image-annotation][]')
                .val(JSON.stringify({text: this.text, shapes: this.shapes}))
                .prependTo(imageContainer);
        });
    });
});
