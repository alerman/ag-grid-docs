import {$} from '../common/vendor';

$(function () {
    $('#page-changelog').each(function () {
        // show/hide tabs
        $('ul.nav-tabs a').click(function(e) {
            e.preventDefault();
            (<any>$(this)).tab('show');
        });

        function skipKey(key) {
            var ignore = ['ArrowRight', 'ArrowLeft', 'Home', 'End', 'ArrowUp', 'ArrowDown', 'ArrowRight', 'Shift', 'Control', 'Alt', 'Meta'];
            return ignore.indexOf(key) >= 0;
        }

        function processSearchValue() {
            let value = (<any>document.getElementById('global_search')).value;
            var searchCriteria = (<any>$).trim(value).replace(/ +/g, ' ').toLowerCase();

            var reportTable = $("table[id^=content_]")[0];

            // hide the more info rows
            $(reportTable).find("tr.jira-more-info").hide();

            var tableRows = $(reportTable).find("tr.jira[jira_data]");

            // 1) filter out rows that DON'T match the current search
            tableRows
                .show()
                .filter(function() {
                    var breakingChangesFail = (<HTMLInputElement>document.getElementById('breaking')).checked && $(this).attr("breaking") === undefined;
                    var deprecationsFail = (<HTMLInputElement>document.getElementById('deprecation')).checked && $(this).attr("deprecation") === undefined;

                    var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
                    var searchTextFails = !~text.indexOf(searchCriteria);

                    return breakingChangesFail || deprecationsFail || searchTextFails;
                })
                .hide();
        }

        // global issue search
        $('#global_search').keyup(function(event) {
            if (skipKey(event.key)) {
                return;
            }

            processSearchValue();
        });

        $("#breaking").click( function(){
            processSearchValue();
        });
        $("#deprecation").click( function(){
            processSearchValue();
        });
        $("span[more-info]").click( function(){
            toggleMoreInfo($(this).attr("data-key"))
        });

        // clearable input (x in global search input)
        jQuery(function ($) {
            function tog(v) {
                return v ? 'addClass' : 'removeClass';
            }

            $(document).on('input', '.clearable', function () {
                $(this)[tog(this.value)]('x');
            }).on('mousemove', '.x', function (e) {
                $(this)[tog(this.offsetWidth - 18 < e.clientX - this.getBoundingClientRect().left)]('onX');
            }).on('touchstart click', '.onX', function (ev) {
                ev.preventDefault();
                $(this).removeClass('x onX').val('').change();
                processSearchValue();
            });
        });

        // more info rows
        function toggleMoreInfo(id) {
            $("#" + id).toggle();
        }
    });
});