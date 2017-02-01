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
        e.preventDefault();
        var images = [];
        jQuery.each(anno.getAnnotations(), function() {
            var imageId = /[^#]*$/.exec(this.src)[0];
            if (!(imageId in images)) {
                images[imageId] = [];
            }
            images[imageId].push({text: this.text, shapes: this.shapes});
        });
        console.log(images);
        // @todo: iterate images, adding annotations to corresponding block
        // key = image id; get closest block-form and add hidden inputs there
        // e.g. jQuery('#' + key).closest('div.block-form');
    });
});
