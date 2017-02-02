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
        if (drawer.hasClass('image-annotation-opened')) {
            // Don't reload the image if the drawer has already been opened.
            return;
        }
        drawer.addClass('image-annotation-opened');
        var blockForm = drawer.closest('div.block-form');
        var attachment = blockForm.find('div.attachment');
        var fileId = attachment.find('input[name$="[file_id]"]').val();
        jQuery.post(imageAnnotationUrl, {fileId: fileId, index: blockForm.data('blockIndex')})
            .done(function(data) {
                var container = blockForm.find('div.image-annotation-container');
                var image = jQuery.parseHTML(data)[0];
                container.append(image);
                image.onload = function() {
                    anno.makeAnnotatable(image);
                    var imageSrc = jQuery(image).attr('src');
                    jQuery.each(container.data('imageAnnotations'), function() {
                        var annotation = JSON.parse(this);
                        annotation.src = imageSrc;
                        anno.addAnnotation(annotation);
                    });
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
            var container = image.closest('div.image-annotation-container');
            jQuery('<input>')
                .attr('type', 'hidden')
                .attr('name', container.data('formStem') + '[options][image-annotation][]')
                .val(JSON.stringify({text: this.text, shapes: this.shapes}))
                .prependTo(container);
        });
    });
});
