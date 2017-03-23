///////////////////////////////////////////
//        NAME : CD_Library_GUI         //
// APPLICATION : CD Library JQuery SPA //
//   COPYRIGHT : (c) 2017 Craig Chant //   
//     VERSION : 0.01                //
//     PURPOSE : CD Library GUI     //
/////////////////////////////////////

// Create CD Library Object
CD_Library = Object.create(CD_Library_Obj);

////////////////////////////////////////////////
// Document Ready Application Initialisation //
//////////////////////////////////////////////
$(function () {

    // show loading popup
    showPopup('Loading...','Loading CD Library, Please wait!');

    // intialise DataTable and pre-filter to show by year
    CD_Library.DataTable = $('#CD_Library').DataTable(
    {
        'ajax': {
            'url':CD_Library.API_URL,
            'type': 'GET',
            'dataSrc': ''
        },
        'columns': [
            { 'data': 'barcode' },
            { 'data': 'catno' },
            { 'data': 'title' },
            { 'data': 'year' },
            { 'data': 'Genres[,].genre', 'visible': false },
            { 'data': 'Styles[,].style', 'visible': false },
            { 'data': 'Labels[,].label', 'visible': false }
        ],
        'language': {
            'emptyTable': 'You do not have any CD\'s in the database. Use form above to add one.',
            'search': 'Search '
        },
        'emptyTable': 'You do not have any CD\'s in the database. Use form above to add one.',
        'dom': "R<'H'fr>t<'F'ip>",
        'jQueryUI': true,
        'paginationType': 'full_numbers',
        'displayLength': 20,
        'columnDefs': [
		                    { 'sWidth': '100px', 'aTargets': [0] },
		                    { 'sWidth': '120px', 'aTargets': [1] },
		                    { 'sWidth': '500px', 'aTargets': [2] },
		                    { 'sWidth': '40px', 'aTargets': [3] },
                            { 'sWidth': '0px', 'aTargets': [4] },
		                    { 'sWidth': '0px', 'aTargets': [5] },
		                    { 'sWidth': '0px', 'aTargets': [6] },


        ],
        'initComplete': function (oSettings, json) {

            // once CD Library has initialised

            // clear loading popup
            clearPopup();

            // add a title for the DataTable body
            $('#CD_Library tbody').attr({ 'title': 'Click a row to view a CD', 'data-icon': 'view' });

            // apply bootstrap styling to DataTable search box
            $('#CD_Library_filter input').addClass('form-control');

            // remove ui class from DataTable header
            $('#CD_Library_wrapper .ui-widget-header').removeClass('ui-widget-header');

            // add event handlers
            addEvents();

            // update GUI
            updateView();

        },
        'order': [[3, 'desc']]

    });

});

/////////////////////////
// Main GUI Functions //
///////////////////////

// update view
function updateView()
{

    // if form action is not lookup
    if (CD_Library.FA != 'L')
    {
        // if not dirty form
        if (!CD_Library.Dirty)
        {
            // update GUI
             updateGUI();

            // if form action is 'Add', unlock barcode
            $('#barcode').prop('readonly', !(CD_Library.FA == 'A'));
        }

        // update buttons
        updateButtons();

    }
    else // if lookup
    {

        // validate
        validate();

        $('#barcode_lookup').focus();
       
    }    

    // Tooltips
    QTip();

}

// lookup CD via barcode
function lookupBarcode(barcode)
{

    // show searching popup 
    showPopup('Searching...','Performing barcode lookup, please wait!');

    // perform lookup via barcode
    CD_Library.lookupBarcode(barcode);

}

// Load CD from datatable
function loadCD()
{
    // load CD
    CD_Library.loadCD();

    // show CD
    showCD();
}

// show CD details
function showCD()
{

    // update view
    updateView();

    // hide lookup
    $('#Lookup_Form').slideUp("slow");

    // show CD details
    $('#CD_Form').slideDown("slow", function () {
        // Focus first enabled button
        $('#CD_Form .btn-group-lg .btn:enabled').focus();
     });

}

// update buttons
function updateButtons()
{
    // hide and disable all buttons
    $('#CD_Form .btn-group-lg .btn').hide().prop('disabled',true);

    // enable and show relevant buttons
    $('#CD_Form .btn-group-lg .btn').each(function (i, ele) {

        switch ($(ele).data('fa')) {
            case 'A':
                if (CD_Library.FA == 'A') {
                    $(ele).show().prop('disabled', false);
                }
                break;
            case 'U':
                if(CD_Library.FA != 'A' && CD_Library.isDirty())
                {
                    $(ele).show().prop('disabled',false);
                }
                    
                break;
            case 'D':
                if (CD_Library.FA != 'A') {
                    $(ele).show().prop('disabled', false)
                };
                break;
        }

    });

    // show discog web lookup
    if (CD_Library.FA == 'D' || CD_Library.FA == 'U')
    {
        $('.discogs').show();
        $('#barcode').addClass('no-right-radius');
    }
    else
    {
        $('.discogs').hide();
        $('#barcode').removeClass('no-right-radius');
    }

}

// close CD 
function closeCD()
{

    // clear form values and classes
    $('#CD_Form input:not(.btn)').val('');
    $('#CD_Form').find('.has-error, .has-success').removeClass('has-error').removeClass('has-success');

    // reset glyphs
    $('#CD_Form').find('form-control-feedback').removeClass('glyphicon-remove-circle');
    $('#CD_Form').find('.form-control-feedback').removeClass('glyphicon-ok-circle');
    $('#CD_Form').find('.form-control-feedback').addClass('glyphicon-pencil');

    // show lookup
    $('#Lookup_Form').slideDown("slow");

    // hide CD details
    $('#CD_Form').slideUp("slow");

    // clear CD 
    CD_Library.clearCD();
    
    // update GUI
    updateView();

}


///////////////////////////
// GUI Helper Functions //
/////////////////////////

// update GUI (helper to keep updateView cleaner)
function updateGUI() {

    // kill selectize tags
    $('input.tags').selectize().each(function (i, obj) {

        // destroy
        obj.selectize.destroy();

        // fix selectize 'required' bug
        $(obj).prop('required', ($(obj).data('required') | false));

    });
     
    if (CD_Library.CD.barcode)
    {
        // add main details
        $('#barcode').val(CD_Library.CD.barcode);
        $('#catno').val(CD_Library.CD.catno);
        $('#year').val(CD_Library.CD.year);
        $('#title').val(CD_Library.CD.title);

        // add genres
        var tags = [];
        $.each(CD_Library.CD.Genres, function (index, obj) {
            tags.push(obj.genre);
        });
        $('#Genres').val(tags.join());

        // add styles
        tags = [];
        $.each(CD_Library.CD.Styles, function (index, obj) {
            tags.push(obj.style);
        });
        $('#Styles').val(tags.join());

        // add labels
        tags = [];
        $.each(CD_Library.CD.Labels, function (index, obj) {
            tags.push(obj.label);
        });
        $('#Labels').val(tags.join());
    }
    else
    {
        // add barcode
        $('#barcode').val($('#barcode_lookup').val());        
    }

    // apply selectize to tags
    $('input.tags').each(function (i, obj) {

        $(obj).selectize({
            plugins: ['remove_button', 'inputMaxlength'],
            inputMaxlength: $(obj).data('maxlength'),
            delimiter: ',',
            persist: false,
            create: function (input) {
                return {
                    value: input,
                    text: input
                }
            },
            createFilter: function (input) { return input.length >= $(obj).data('minlength'); },
            onChange: function () {

                // set dirty 
                CD_Library.Dirty = true;

                // update GUI
                updateView();
            }

        });

        // add validation
        $('#' + $(obj).attr('id') + '-selectized').on('invalid', function () { checkValid(this);})

    });

    // validate 
    validate();

}


// add events to GUI
function addEvents()
{
        
    // input validation 
    $('.validate:not(div)').on('change', function () { checkValid(this); });
    $('.validate:not(div)').on('input', function () { checkValid(this); });
    $('.validate:not(div)').on('invalid', function () { checkValid(this); });

    // form control focus 
    $('.form-control').on('focus', function () {
        focusControl(this);
    });

    // form control focusout
    $('.form-control').on('focusout', function () {
        blurControl(this);
    });

    // select barcode content on focus
    $('#barcode_lookup').on('focus', function (e) { $(this).select(); });

    // add row select for DataTable
    $('#CD_Library tbody').on('click', 'tr', function () {

        if (!(CD_Library.selectCD($(this)))) {
            closeCD();
        }
        else {
            showCD();
        }

    });

    // close CD 
    $('.close-cd').on('click', function () {
        closeCD();
    });

    // CD form submit buttons for Form Action (FA)
    $('#CD_Form .btn-group-lg .btn').on('click',function (e) {
        CD_Library.FA = $(this).data('fa');
    });

    // discogs website 
    $('.btn.discogs').on('click', function () {
        window.open(CD_Library.discogsWeb(), 'discogs');
    });

    // Lookup form submission
    $('#Lookup_Form').on('submit', function (e) {

        // prevent form submission
        e.preventDefault();
        
        // check if already exists
        var exists = CD_Library.exists($('#barcode_lookup').val());

        // exists - show CD
        if (exists)
        {
            // populate CD object from selected DataTable row
            CD_Library.loadCD();

            // show CD
            showCD();

        }
        else // doesn't exist - lookup
        {
            // perform barcode lookup
            lookupBarcode($('#barcode_lookup').val());
        }
         
    });

    // lookup found 
    // Note: Currently I only use first result returned. 
    //       loadLookup requires a single object containing CD object attributes, not an array!
    //       I may refactor to give user a popup with multiple choice they can select from. - food for thought!
    //       This will normally only return mutiple if catalogue number is used as barcode should be unique.
    //       However, there may be errors in the Discogs API data, so duplicates are possible.
    $('#CD_Library').on('lookup_found', function (e, obj) {

        // remove searching dialog
        clearPopup();

        // form action (Add CD);
        CD_Library.FA = 'A';

        // Process lookup result
        CD_Library.loadLookup(obj.data[0], obj.barcode);

        // show CD
        showCD();

    });

    // lookup error
    $('#CD_Library').on('lookup_error', function (e, obj) {
        showDialog(obj.jqXHR.responseText);
    });

    // lookup not found
    $('#CD_Library').on('lookup_not-found', function (e, obj) {

        // remove searching dialog
        clearPopup();

        var dialog = {
            resizable: true,
            title: 'Lookup -&gt; Not found',
            icon: 'not-found',
            content: '<p>CD with ' + ((obj.data.catno) ? 'catalogue number \'' +
                     obj.data.catno : 'barcode \'' + obj.data.barcode) +
                     '\' could not be found.</p><p>What do you want to do?<p>',
            buttons: []
        };
        
        // add relevant buttons
        if(!obj.data.catno)
        {
            // search by catno
            dialog.buttons.push(
            {
                text: 'SEARCH BY CATNO',
                click: function () {

                    // don't allow blank
                    var catno = '';
                    while (catno == '') {
                        catno = prompt('Please enter catalogue number','');
                    }

                    // perform catalogue number lookup (remove spaces otherwise Discogs API lookup fails?)
                    if (catno) {
                        showPopup('Searching...','Performing catno lookup, please wait!');
                        CD_Library.lookupCatNo(obj.data.barcode, catno.replace(new RegExp(' ', 'g'), '').toUpperCase());
                    }

                    // remove dialog
                    $(this).dialog('destroy').remove();

                },
                title: 'Search by catalogue number',
                class: 'btn btn-primary btn-default',
                icon: 'search'
            });
        };

        // manuallly add CD        
        dialog.buttons.push(
            {
                text: 'MANUALLY ADD CD',
                click: function () {

                    // remove dialog
                    $(this).dialog('destroy').remove();

                    // form action (Add CD)
                    CD_Library.FA = 'A';

                    // show CD
                    showCD();

                },
                title: 'Add CD to database',
                class: 'btn btn-success btn-default',
                icon: 'add'
            });
        
        // No don't bother!
        dialog.buttons.push(
            {
                text: 'NO -> DON\'T BOTHER!',
                class: 'btn btn-danger btn-default',
                title: 'Close Window',
                icon: 'close',
                click: function () {

                    // remove dialog
                    $(this).dialog('destroy').remove();
                }
            }
        );       

        // show dialog for failed lookup
        showDialog(dialog);
    });   

    // dirty form change event for CD 
    $('#CD_Form').change(function (e) {

        if (!CD_Library.Dirty)
        {
            CD_Library.Dirty = true;
        }

        // update GUI
        updateView();

    });

    // CD form submission
    $('#CD_Form').on('submit', function (e) {

        // prevent form submission
        e.preventDefault();

        // show confirm dialog 
        showDialog({
            title: CD_Library.REST[CD_Library.FA].title,    
            content: CD_Library.REST[CD_Library.FA].content,
            icon: CD_Library.REST[CD_Library.FA].icon,
            buttons: [
                        {
                            text: 'YES -> PERFORM ACTION',
                            click: function () {
                                
                                // run AJAX request for CRUD operation
                                CD_Library.performCRUD(function (obj) // success callback
                                {
                                    // reload DataTable
                                    reload();

                                    // set whether to clear search
                                    CD_Library.ClearSearch = (CD_Library.FA == 'D');

                                    // show OK message
                                    showDialog({
                                        content: '<p>' + obj.data + '</p>',
                                        title: 'Processing Complete',
                                        icon: 'info',
                                        buttons: [
                                                    {
                                                        text: 'OK',
                                                        click: function () {

                                                            $(this).dialog('destroy').remove();

                                                            // update GUI
                                                            closeCD(true);
                                                        },
                                                        class: 'btn btn-success btn-default',
                                                        title: 'Close Window',
                                                        icon: 'close'
                                                    }
                                        ]
                                    });
                                },
                                function (obj) // failed callback    
                                {                                 
                                    // show error
                                    showDialog({
                                        content: obj.textStatus + ' : ' + obj.jqXHR.responseText,
                                    });

                                });

                                // remove dialog
                                $(this).dialog('destroy').remove();

                            },
                            title: 'YES',
                            icon: 'ok',
                            class: 'btn btn-success btn-default'
                        },
                        {
                            text: 'NO -> I CHANGED MY MIND',
                            click: function () { $(this).dialog('destroy').remove(); },
                            class: 'btn btn-danger btn-default',
                            title: 'NO',
                            icon: 'cancel'
                        }
            ],
        });     

    });

}

// show popup messages
function showPopup(title, content)
{
    showDialog({
        content: '<p>' + content + '</p>',
        icon: 'search',
        title: title,
        buttons: [],
        divID: 'popup',
        width: 300,
        height:80
    });

}
// clear popup
function clearPopup() {
    $('#popup').dialog('destroy').remove();
}

// reload datatables data
function reload() {

    // show loading popup
    showPopup('Loading...', 'Loading CD Library, Please wait!');

    // reload data
    CD_Library.reload(function () { clearPopup(); });
}
