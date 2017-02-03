jQuery(document).ready(function () {
    jQuery('img.image-annotation-image').each(function() {
        anno.makeAnnotatable(this);
        var image = jQuery(this);
        var imageSrc = image.attr('src');
        anno.hideSelectionWidget(imageSrc);
        jQuery.each(image.data('imageAnnotations'), function() {
            this.src = imageSrc;
            this.editable = false;
            anno.addAnnotation(this);
        });
    });
});
