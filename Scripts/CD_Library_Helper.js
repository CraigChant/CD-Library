///////////////////////////////////////////
//        NAME : CD_Library_Helper      //
// APPLICATION : CD Library JQuery SPA //
//   COPYRIGHT : (c) 2017 Craig Chant //   
//     VERSION : 0.01                //
//     PURPOSE : General GUI Helper //
/////////////////////////////////////

// show JQUI dialog
function showDialog(options) {

    // default options      
    var myOptions = {
        position: { my: 'center', at: 'center' },
        modal: true,
        width: 'auto',
        height: 'auto',
        show: 'explode',
        hide: 'explode',
        resizable: true,
        draggable: true,
        divID: 'dialog',
        title: 'The following error has occured.',
        icon: 'error',
    };

    // merge supplied options
    $.extend(true, myOptions, options);

    // check if div exits, otherwise add it
    if ($('#' + myOptions.divID).length == 0) {
        jQuery('<div/>', {
            id: myOptions.divID,
        }).appendTo('body');
    }

    // add message content
    $('#' + myOptions.divID).html(myOptions.content);

    // munge title
    myOptions.title = '<span class="glyphicon ' + CD_Library.Icons[myOptions.icon] + '"></span> &nbsp;' + myOptions.title;

    // add buttons (default CLOSE)
    if (!myOptions.buttons) {
        myOptions.dialogClass = 'no-close';
        myOptions.buttons = [{
            text: 'CLOSE',
            click: function () { $(this).dialog('destroy').remove(); },
            title: 'Close Window',
            class: 'btn btn-primary btn-default',
            icon: 'close'
        }];
    }

    // add icons for button QTips
    $.each(myOptions.buttons, function (i, obj) {
        obj.create = function () {
            $(this).attr({ 'data-icon': obj.icon });
        };
    });

    // clear UI nopad
    $('#' + myOptions.divID).removeClass('nopad');

    // show dialog
    $('#' + myOptions.divID).dialog(myOptions);

    // apply QTtip 
    $('.ui-dialog-titlebar-close').attr({ 'title': 'Close Window', 'data-icon': 'close' });
    $('.ui-dialog button').on('click', function () { QTip(); });

    // add tooltips
    QTip();

    // focus default button
    $('.ui-dialog .btn-success').focus();

}

// fix bug with HTML in title attribute of JQUI dialog
jQuery.widget('ui.dialog', jQuery.extend({}, jQuery.ui.dialog.prototype, {
    _title: function (titleBar) {
        titleBar.html(this.options.title || '&#160;');
    }
}));

// QTip2 replacement for JQUI Tooltip
function QTip() {

    var myPos = {
        bot: { target: 'mouse', my: 'top left', at: 'bottom right', adjust: { x: 10, y: 20 } },
        top: { target: 'mouse', my: 'bottom left', at: 'top right', adjust: { x: 5, y: 0 } }
    };

    // destroy artifacts before creating again
    $('.qtip').each(function () {
        $(this).data('qtip').destroy();
    })

    // create tooltip
    $('[title]').each(function () {
        $(this).qtip({
            style: { classes: 'qtip-light qtip-shadow qtip-rounded' },
            position: ($(this).data('qtop')) ? myPos.top : myPos.bot,
            content: { text: '<span class="glyphicon ' + CD_Library.Icons[$(this).data('icon')] + '"></span> &nbsp;' + $(this).attr('title') },
            suppress: true
        });

    });

}

// add focus class
function focusControl(ele) {
    $(ele).closest('.has-feedback').addClass('control-focus');
}

// remove focus class
function blurControl(ele) {
    $(ele).closest('.has-feedback').removeClass('control-focus');
}

// validate pre-loaded form data
function validate() {
    $('.validate').each(function () {
        if ($(this).val() != '') {
            checkValid(this);
        }
    });
}

// validator to work with bootstrap & selectize
function checkValid(ele) {

    // ignore browser validation errors
    try {
        // get closest parent with has-feedback
        var obj = $(ele).closest('.has-feedback');

        // check for selectized
        if ($(ele).hasClass('selectized')) {

            // clear active as seems to be sticky
            obj.find('.item').removeClass('active');

            // set element for validating
            ele = obj.find('.selectize-input').find('input')[0];

            // add tooltip to menu selection
            obj.find('.selectize-dropdown-content').attr('title', 'Click to add');

            // fix for QTip artifacts & remove 
            QTip();
        }

        // clear custom errors first.
        ele.setCustomValidity('');

        // check validity
        if (ele.validity.valid) {
            // set classes for valid
            obj.removeClass('has-error');
            obj.addClass('has-success');
            obj.find('.form-control-feedback').removeClass('glyphicon-pencil').removeClass('glyphicon-remove-circle');
            obj.find('.form-control-feedback').addClass('glyphicon-ok-circle');

        }
        else {
            // set classes for invalid
            obj.removeClass('has-success');
            obj.addClass('has-error');
            obj.find('.form-control-feedback').removeClass('glyphicon-pencil').removeClass('glyphicon-ok-circle');
            obj.find('.form-control-feedback').addClass('glyphicon-remove-circle');

            // custom error messages for pattern mismatch
            if (ele.validity.patternMismatch && $(ele).data('error')) {
                ele.setCustomValidity($(ele).data('error'));
            }

        }

    }
    catch (e) { };

}

// maxlength plugin for selectize
Selectize.define('inputMaxlength', function (options) {
    var self = this;
    this.setup = (function () {
        var original = self.setup;
        return function () {
            original.apply(this, arguments);
            this.$control_input.attr('maxlength', this.settings.inputMaxlength);
        };
    })();
});
