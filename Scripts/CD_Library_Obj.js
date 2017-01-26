///////////////////////////////////////////
//        NAME : CD_Library_Obj         //
// APPLICATION : CD Library JQuery SPA //
//   COPYRIGHT : (c) 2017 Craig Chant //   
//     VERSION : 0.01                //
//     PURPOSE : CD Library Object  //
/////////////////////////////////////
var CD_Library_Obj =
{
    DataTable: null, // datatables object
    CD: { // CD object
        barcode: null,
        catno: null,
        year: null,
        title: null,
        Genres: [],
        Styles: [],
        Lables: []
    },
    FA: 'L', // form action flag (L = Lookup , A = Add, U = Update, D = Delete) - default: Lookup
    Dirty: false, // Dirty form flag
    ClearSearch: true, // clear search on CD Close
    API_URL: '/api/CDLibraryAPI', // CD Library Web API URL
    Lookup_API: 'https://api.discogs.com/database/search', // Discogs Web API URL
    Auth_Token: 'YOU NEED TO PUT YOUR OWN API TOKEN HERE', // Discogs Web API authorisation token
    REST: { // REST config settings for form actions & dialogs
        A: {
            type: 'POST',
            icon: 'add',
            title: 'Add CD',
            content: 'Add CD to database, are you sure?',
        },
        U: {
            type: 'PUT',
            icon: 'upd',
            title: 'Update CD',
            content: 'Update CD in database, are you sure?',
        },
        D: {
            type: 'DELETE',
            icon: 'del',
            title: 'Delete CD',
            content: 'Delete CD from database, are you sure?',
        }
    },
    _CRUD: // CRUD attributes (Private AJAX Data Helper)
    function () {

        var CRUD = {};

        // check form action and set AJAX data
        switch (this.FA) {

            case 'A': // Create (POST)
            case 'U': // Updade (PUT)
                CRUD.data = this.loadGUI();
                CRUD.URL = this.API_URL;
                break;

            case 'D': // Delete (DELETE)
                CRUD.data = null;
                CRUD.URL = this.API_URL + '/' + this.CD.barcode;
                break;
        }

        return CRUD;
    },
    Icons: { // window & tooltip icons
        'close': 'glyphicon-remove',
        'cancel': 'glyphicon-remove',
        'ok': 'glyphicon-ok',
        'add': 'glyphicon-floppy-disk',
        'error': 'glyphicon-warning-sign',
        'del': 'glyphicon-floppy-remove',
        'upd': 'glyphicon-floppy-saved',
        'not-found': 'glyphicon-ban-circle',
        'barcode': 'glyphicon-barcode',
        'title': 'glyphicon-headphones',
        'catno': 'glyphicon-book',
        'year': 'glyphicon-calendar',
        'genres': 'glyphicon-music',
        'styles': 'glyphicon-music',
        'labels': 'glyphicon-tags',
        'search': 'glyphicon-search',
        'view': 'glyphicon-eye-open',
        'info': 'glyphicon-info-sign',
        'globe': 'glyphicon-globe'
    },
    performCRUD: function (callback_ok, callback_fail) {

        // get CRUD data 
        var CRUD = this._CRUD();

        // set AJAX request for Action
        var AJAX = {
            url: CRUD.URL,
            type: this.REST[this.FA].type,
            success: function (data, textStatus, jqXHR) {
                callback_ok({ 'data': data, 'jqXHR': jqXHR, 'textStatus': textStatus })
            },
            error: function (jqXHR, textStatus, errorThrown) {
                callback_fail({ 'jqXHR': jqXHR, 'textStatus': textStatus, 'errorThrown': errorThrown });
            }
        };

        // add data if required
        if (CRUD.data) {
            AJAX.data = JSON.stringify(CRUD.data);
            AJAX.contentType = 'application/json; charset=utf-8';
            AJAX.dataType = 'json';
            AJAX.processData = false;
        }

        // perfrom AJAX 
        $.ajax(AJAX);
    },
    clearCD: function () { // Clear CD object & datatable selection

        // clear datatables selection
        this.DataTable.rows({ selected: true }).deselect();

        // check to clear search
        if (this.ClearSearch) {
            // clear search
            this.DataTable.search('').draw();
        }

        // reset attributes
        this.CD = {};
        this.FA = 'L';
        this.Dirty = false;
        this.ClearSearch = false;

    },
    loadCD: function () { // load CD from datatable

        // form action (intial Delete)
        this.FA = 'D';

        // set DIRTY form flag
        this.Dirty = false;

        // set clear search
        this.ClearSearch = true;

        // populate CD object
        this.CD = this.DataTable.row({ selected: true }).data();
    },
    selectCD: function (obj) { // Toggle CD select & load if selected

        var selected = false;

        // need to check for data as 'no records' in table message is seen as a row and shouldn't be clickable       
        if (this.DataTable.page.info().recordsDisplay > 0) {
            // remove selected
            if ($(obj).hasClass('selected')) {
                // deselect
                this.DataTable.row($(obj)).deselect();
            }
            else {
                selected = true;

                // delesect all rows
                this.DataTable.rows({ selected: true }).deselect();

                // add selected
                this.DataTable.row($(obj)).select();

                // load CD from selected DataTable row
                this.loadCD();

            }
        }

        return selected;

    },
    loadGUI: function () { // read the CD_Form GUI and return as CD formatted object

        // order of elements is important and needs to match the datatables order to enable comparison via JSON stingify
        var obj = {};

        // parse barcode
        var barcode = $('#barcode').val();

        // add genres
        obj.Genres = [];
        $.each($('#Genres').val().split(','), function (i, val) {
            obj.Genres.push({ barcode: barcode, genre: val });
        });

        // add labels
        obj.Labels = [];
        $.each($('#Labels').val().split(','), function (i, val) {
            obj.Labels.push({ barcode: barcode, label: val });
        });

        // add styles
        obj.Styles = [];
        $.each($('#Styles').val().split(','), function (i, val) {
            obj.Styles.push({ barcode: barcode, style: val });
        });

        // add main details
        obj.barcode = barcode;
        obj.catno = $('#catno').val();
        obj.year = parseInt($('#year').val());
        obj.title = $('#title').val();

        return obj;

    },
    isDirty: function () { // is form really dirty (ie. has user actually altered anything from original state)

        // check dirty flag
        if (this.Dirty) {
            // compare CD with GUI
            return JSON.stringify(this.CD) !== JSON.stringify(this.loadGUI())
        }
        else {
            return false;
        }

    },
    reload: function (callback) { // reload datatable via AJAX source
        this.DataTable.ajax.reload(callback);
    },
    exists: function (barcode) { // check if CD exists in datatable (ie in the database)

        var found = false;

        // check if records in datatable
        if (this.DataTable.page.info().recordsTotal > 0) {

            // check if already exists
            this.DataTable.search(barcode).draw();

            // if found - select it
            if (this.DataTable.page.info().recordsDisplay == 1) {

                // delesect all rows
                this.DataTable.rows({ selected: true }).deselect();

                // select found row
                this.DataTable.row(':eq(0)', { page: 'current' }).select();

                found = true;
            }
        }

        return found;
    },
    lookupBarcode: function (barcode) { // lookup via barcode
        this.lookup({ 'barcode': barcode }, barcode);
    },
    lookupCatNo: function (barcode, catno) { // lookup via catalogue number
        this.lookup({ 'catno': catno }, barcode);
    },
    lookup: function (mydata, barcode) { // lookup helper - you could call it direct with correctly formated args
        // set AJAX object
        var AJAX = {
            url: this.Lookup_API,
            type: 'GET',
            data: {
                per_page: 1,
                page: 1,
                token: this.Auth_Token
            },
            cache: false,
            contentType: false,
            processData: true,
            success: function (data, status, jqXHR) {
                if (data.results.length == 0) {
                    $('#CD_Library').trigger('lookup_not-found', { 'data': mydata });
                }
                else { 
                    $('#CD_Library').trigger('lookup_found', { 'data': data.results, 'barcode': barcode });
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#CD_Library').trigger('lookup_error', { 'jqXHR': jqXHR, 'textStatus': textStatus, 'errorThrown': errorThrown } );
            }
        };

        // add lookup data to AJAX object
        $.extend(true, AJAX.data, mydata);

        // perform AJAX request
        $.ajax(AJAX);
    },
    loadLookup: function loadLookup(data, barcode) { // load lookup data into CD   

        var me = this;

        // add main details
        me.CD.barcode = barcode;
        me.CD.catno = data.catno.toUpperCase();
        me.CD.year = data.year;
        me.CD.title = data.title;

        // add genres
        me.CD.Genres = [];
        var genres = {};
        $.each(data.genre, function (i, val) {
            // ignore duplicates
            if (!(val in genres)) {
                me.CD.Genres.push({ 'barcode': barcode, 'genre': val });
                genres[val] = true;
            }
        });

        // add styles
        me.CD.Styles = [];
        var styles = {};
        $.each(data.style, function (i, val) {
            // ignore duplicates
            if (!(val in styles)) {
                me.CD.Styles.push({ 'barcode': barcode, 'style': val });
                styles[val] = true;
            }
        });

        // add labels
        me.CD.Labels = [];
        var labels = {};

        $.each(data.label, function (i, val) {
            // ignore duplicates
            if (!(val in labels)) {
                me.CD.Labels.push({ 'barcode': barcode, 'label': val })
                labels[val] = true;
            }

        });
    },
    discogsWeb: function () {
        return 'https://www.discogs.com/search/?type=all&catno=' + encodeURI(this.CD.catno);
    }

};

