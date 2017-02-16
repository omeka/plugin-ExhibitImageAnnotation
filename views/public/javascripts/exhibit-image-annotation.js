var Omeka = Omeka || {};
jQuery(document).ready(function () {

    Omeka.ExhibitImageAnnotation = {
        /**
         * Add annotations to all annotatable images on the page.
         */
        addAnnotations: function() {
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
        },
    };

    // Add image annotations on page load.
    Omeka.ExhibitImageAnnotation.addAnnotations();

    // Re-add image annotations when page resizes. Otherwise the annotations
    // will not scale with the zoom level. Set a delay to avoid calling the
    // function repeatedly.
    var timeoutID;
    jQuery(window).on('resize', function(e) {
        clearTimeout(timeoutID);
        timeoutID = setTimeout(function() {
            Omeka.ExhibitImageAnnotation.addAnnotations();
        }, 800);
    });
});
