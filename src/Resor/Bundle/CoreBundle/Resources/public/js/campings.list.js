$(function() {
    var $table = $('#campings-list'),
        ajaxUrl = $table.data('ajax-url');

    $table.on('click', '.btn-enable, .btn-disable', function(e) {
        var $this = $(this),
            $other = $this.siblings('button'),
            campingId = $this.parent().data('camping-id'),
            isEnabling = $this.hasClass('btn-enable'),
            ajaxAction = isEnabling ? 'activer' : 'desactiver';

        if ($this.hasClass('active')) {
            return;
        }

        $this.prepend('<span class="fa fa-spin fa-cog"></span> ')
            .addClass('disabled');
        $other.addClass('disabled');
        $.ajax({
            url: ajaxUrl + 'admin/camping/' + campingId + '/' + ajaxAction,
            success: function() {
                $this.button('toggle');
                $other.button('toggle');
            },
            complete: function() {
                $this.find('span').remove();
                $this.text($this.text().trim())
                    .removeClass('disabled');
                $other.removeClass('disabled');
            }
        });
    });
});