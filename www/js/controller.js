$(function () {

    var initData = [
        {
            name: "Food",
            vocabulary: [
                {
                    name: "apple",
                    meaning: "(n.) 蘋果"
                },
                {
                    name: "banana",
                    meaning: "(n.) 香蕉"
                }
            ]
        },
        {
            name: "Sport",
            vocabulary: [
                {
                    name: "jog",
                    meaning: "(v.) 慢跑"
                }
            ]
        },
        {
            name: "自己紹介",
            vocabulary: [
                {
                    name: "[将来](しょうらい)の[夢](ゆめ)",
                    meaning: "將來的夢想"
                }
            ]
        }
    ];

    function nl2br(str) {
        return str.replace(/([^>])\n/g, '$1<br/>\n');
    }

    var br2nl = function (varTest) {
        return varTest.replace(/<br\/>/g, "\r");
    };

    var Init = function () {
        var category;
        //window.localStorage.WZ_categories = JSON.stringify(initData);
        if (window.localStorage && !window.localStorage.WZ_setting) {
            WZ_setting = {
                revert: false,
                vocabularyDisplay: false
            };
            window.localStorage.WZ_setting = JSON.stringify(WZ_setting);
        }

        if (window.localStorage && window.localStorage.WZ_categories ){
            category = JSON.parse(window.localStorage.WZ_categories);
        }
        else if (window.localStorage && window.localStorage.categories) {
            var tmp = JSON.parse(window.localStorage.categories);
            category = [];
            for (var i in tmp) {
                var singleCategory = {
                    name: i,
                    vocabulary: []
                };
                for (var j in tmp[i]) {
                    singleCategory.vocabulary.push({
                        name: j,
                        meaning: tmp[i][j]
                    });
                }
                category.push(singleCategory);
            }

            window.localStorage.WZ_categories = JSON.stringify(category);
        }
        else if (window.localStorage) {
            window.localStorage.WZ_categories = JSON.stringify(initData);
            category = JSON.parse(window.localStorage.WZ_categories);
        }
        else {
            category = initData;
        }

        resetCategoryList();
    };

    var resetCategoryList = function () {
        $("#category-list").html('');
        var category = JSON.parse(window.localStorage.WZ_categories);
        for (var i = 0 ; i < category.length ; ++i) {
            $("#category-list").html($("#category-list").html() + "<li data-id='" + i + "'>" + category[i].name + "<div style='float: right; margin: 5px;'>" +
                "<img src='images/Data-Edit.png' class='button' id='editCategoryIndex'/> " +
                "<img src='images/delete.png' class='button' id='deleteCategoryIndex'/>" +
                "</div></li>");
        }

        sortCategory();
    }
    
    var sortCategory = function () {
        $("#category-list").sortable({
            stop: function () {
                var category = JSON.parse(window.localStorage.WZ_categories);
                var newCategory = [];

                $('#category-list li').each(function () {
                    newCategory.push(category[$(this).attr('data-id')]);
                });
                window.localStorage.WZ_categories = JSON.stringify(newCategory);
                resetCategoryList();
            }
        }).disableSelection();
    };
    
    var vocabularyNamePreparser = function(name){
        return name.replace(/\[([^\]]*)\]\(([^\)]*)\)/g, "<ruby>$1<rt>$2</rt></ruby>");
    }

    var resetVocabularyList = function () {
        $("#vocabulary-list").html('');
        var category = JSON.parse(window.localStorage.WZ_categories);
        var categoryId = $('#page-title2').attr("data-id");
        var setting = JSON.parse(window.localStorage.WZ_setting);
        var revert = setting.revert;
        var openVocabulary = setting.vocabularyDisplay;
        for (var i = 0 ; i < category[categoryId].vocabulary.length; ++i) {
            if (openVocabulary) {
                $("#vocabulary-list").html($("#vocabulary-list").html() + "<li data-id='" + i + "' class='card'>" +
                    "<div class='page-title'  style='clear: both;'>" + vocabularyNamePreparser(category[categoryId].vocabulary[i].name) + "<div style='float: right; margin: 3px;'>" +
                        "<img src='images/Data-Edit-Black.png' class='button' id='editVocabularyIndex' /> " +
                        "<img src='images/delete-Black.png' class='button' id='deleteVocabularyIndex' />" +
                        "</div></div>" + 
                    "<div style='clear: both;'>" + category[categoryId].vocabulary[i].meaning + "</div></li>");
            }
            else {
                if (revert) {
                    $("#vocabulary-list").html($("#vocabulary-list").html() + "<li data-id='" + i + "'>" + category[categoryId].vocabulary[i].meaning +
                        "<div style='float: right; margin: 3px'>" +
                        "<img src='images/Data-Edit.png' class='button' id='editVocabularyIndex' /> " +
                        "<img src='images/delete.png' class='button' id='deleteVocabularyIndex' />" +

                        "</div>" +
                        "</li>");
                }
                else {
                    $("#vocabulary-list").html($("#vocabulary-list").html() + "<li data-id='" + i + "'>" + vocabularyNamePreparser(category[categoryId].vocabulary[i].name) +
                        "<div style='float: right; margin: 3px'>" +
                        "<img src='images/Data-Edit.png' class='button' id='editVocabularyIndex' /> " +
                        "<img src='images/delete.png' class='button' id='deleteVocabularyIndex' />" +
                        "</div>" +
                        "</li>");
                }
            }
        }

        if (openVocabulary) {
            $('.vocabularyDisplayFalse').hide();
            $('.vocabularyDisplayTrue').show();
        }
        else {
            $('.vocabularyDisplayFalse').show();
            $('.vocabularyDisplayTrue').hide();
        }
        sortVocabulary();
    }

    var sortVocabulary = function () {
        $("#vocabulary-list").sortable({
            stop: function () {
                var category = JSON.parse(window.localStorage.WZ_categories);
                var categoryId = $('#page-title2').attr("data-id");
                var newVocabulary = [];

                $('#vocabulary-list li').each(function () {
                    newVocabulary.push(category[categoryId].vocabulary[$(this).attr('data-id')]);
                });
                
                category[categoryId].vocabulary = newVocabulary;
                window.localStorage.WZ_categories = JSON.stringify(category);
                resetVocabularyList();
            }
        }).disableSelection();
    };

    var modifyCategory = function (value, dataId) {
        if (window.localStorage.WZ_categories) {
            var category = JSON.parse(window.localStorage.WZ_categories);
            if (dataId !== "") {
                category[dataId].name = value;
            }
            else {
                category.push({ name: value, vocabulary: [] });
            }
            window.localStorage.WZ_categories = JSON.stringify(category);
        }
    };

    var modifyVocabulary = function (value, meaning, categoryId, dataId) {
        if (window.localStorage.WZ_categories) {
            var category = JSON.parse(window.localStorage.WZ_categories);
            if (dataId !== "") {
                category[categoryId].vocabulary[dataId].name = value;
                category[categoryId].vocabulary[dataId].meaning = meaning;
            }
            else {
                category[categoryId].vocabulary.push({
                    name: value,
                    meaning: nl2br(meaning)
                });
            }
            
            window.localStorage.WZ_categories = JSON.stringify(category);
        }
    };

    var allClose = function (callback) {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        $('#importPage').slideUp('fast', function () {
            $('#exportPage').slideUp('fast', function () {
                $('#about').slideUp('fast', function () {
                    $('#addCategory').slideUp('fast', function () {
                        $('#category').val("");
                        $('#category').attr("data-id", "");
                        $('#page-title1').html("<img src='images/Previous.png' class='previous' data-back='index' /> 新增分類");

                        $('#addVocabularyPage').slideUp('fast', function () {
                            $('#vocabularyName').val("");
                            $('#vocabularyName').attr("data-id", "");
                            $('#vocabularyMeaning').val("");
                            $('#page-title4').html("<img src='images/Previous.png' class='previous' data-back='categoryContent' /> 新增單字");

                            $('#vocabularyContent').slideUp('fast', function () {
                                $('#page-title5').animate({
                                    'font-size': '19pt'
                                }, 'fast');

                                $('#page-title5 img').animate({
                                    'height': '20px'
                                }, 'fast', function () {
                                    $('#page-title5 img.previous').animate({
                                        'height': '25px'
                                    }, 'fast');
                                });

                                $('#menu3').slideUp();

                                $('#categoryContent').slideUp('fast', function () {
                                    $('#page-title2').animate({
                                        'font-size': '24pt'
                                    }, 'fast');

                                    $('#page-title2 img').animate({
                                        'height': '20px'
                                    }, 'fast', function () {
                                        $('#page-title2 img.previous').animate({
                                            'height': '25px'
                                        }, 'fast');
                                    });

                                    $('#menu2').slideUp();

                                    $('#index').slideUp('fast', function () {
                                        $('#page-title').css({
                                            'font-size': '24pt'
                                        });

                                        $('#page-title img').animate({
                                            'height': '20px'
                                        }, 'fast', function () {
                                            $('#page-title img.previous').animate({
                                                'height': '25px'
                                            }, 'fast');
                                        });
                                        $('#menu').slideUp();
                                        callback();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    };

    $('#addCategoryForm').submit(function () {
        var value = $('#category').val();
        var dataId = $('#category').attr("data-id");
        var navTo = $('#addCategory').find('.previous').data('back');
        modifyCategory(value, dataId);

        resetCategoryList();
        allClose(function(){
            $('#page-title2').html('<img src="images/Previous.png" class="previous" data-back="index" /> ' +
                value + ' <img src="images/Arrowhead-Down-01.png" />');
            $('#'+navTo).slideDown('fast');
        });
        return false;
    });

    

    $('#programName').click(function () {
        $('#about').slideToggle('fast');
    });

    $('#click_addCategory, #click_addCategory1').click(function () {
        allClose(function () {
            $('#addCategory').slideDown('fast');
        });
    });

    $('#click_editCategory').click(function () {
        allClose(function () {
            var category = JSON.parse(window.localStorage.WZ_categories);
            var categoryName = category[$('#page-title2').data('id')].name;
            $('#page-title1').html("<img src='images/Previous.png' class='previous' data-back='categoryContent' /> 編輯分類");
            $('#category').val(categoryName);
            $('#category').attr('data-id', $("#page-title2").attr('data-id'));
            $('#addCategory').slideDown('fast');
        });
    });

    $('#category-list').on('click', 'li #editCategoryIndex', function (event) {
        event.stopPropagation();
        $(this).attr('src', 'images/Data-Edit-Click.png');
        var that = this;
        allClose(function () {
            var category = JSON.parse(window.localStorage.WZ_categories);
            var categoryId = $(that).closest('li').data('id');
            var categoryName = category[categoryId].name;
            $('#page-title1').html("<img src='images/Previous.png' class='previous' data-back='index' /> 編輯分類");
            $('#category').val(categoryName);
            $('#category').attr('data-id', categoryId);
            $('#addCategory').slideDown('fast');
            $(that).attr('src', 'images/Data-Edit.png');
        });
    });

    $('#export').click(function () {
        $('#exportData').val(window.localStorage.WZ_categories);
        allClose(function () {
            $('#exportPage').slideDown('fast');
        });
    });

    $('#import').click(function () {
        allClose(function () {
            $('#importPage').slideDown('fast');
        });
    });

    $('.page-title').on('click', '.previous', function (event) {
        event.stopPropagation();
        $(this).attr('src', 'images/PreviousClick.png');
        var that = this;
        allClose(function () {
            $('#'+$(that).data('back')).slideDown('fast');
            $(that).attr('src', 'images/Previous.png');
        });
    });

    $('#importForm').submit(function (event) {
        event.preventDefault();
        if (confirm('確定匯入資料？')) {
            try{
                var newData = JSON.parse($('#importData').val());
                if (!newData.length) throw new Error();

                var categories = [];
                for (var i = 0 ; i < newData.length ; ++i) {
                    var category = { name: newData[i].name, vocabulary: []};
                    for (var j = 0 ; j < newData[i].vocabulary.length ; ++j) {
                        var vocabulary = { name: newData[i].vocabulary[j].name, meaning: newData[i].vocabulary[j].meaning };
                        category.vocabulary.push(vocabulary);
                    }
                    categories.push(category);
                }
                var localCategory = JSON.parse(window.localStorage.WZ_categories);
                for (var i = 0 ; i < categories.length ; ++i) {
                    localCategory.push(categories[i]);
                }
                window.localStorage.WZ_categories = JSON.stringify(localCategory);
                resetCategoryList();
                allClose(function () {
                    $('#index').slideDown('fast');
                });
            }
            catch (e) {
                alert("資料有誤，請再確認資料是否正確。");
            }
        }
        return false;
    });

    $('#clearAll').click(function () {
        if (confirm("確定要刪除所有資料？(建議先匯出備份)")) {
            window.localStorage.WZ_categories = JSON.stringify([]);
            resetCategoryList();
            allClose(function () {
                $('#index').slideDown('fast');
            });
        }
    });

    $('#page-title5').on('click', (function () {
        var toggle = false;
        return function () {
            toggle = !toggle;
            if (toggle) {
                $('#page-title5').animate({
                    'height': '20px',
                    'font-size': '19pt'
                }, 'fast');

                $('#page-title5 img').animate({
                    'height': '16px'
                }, 'fast', function () {
                    $('#page-title5 img.previous').animate({
                        'height': '20px'
                    }, 'fast');
                });
            }
            else {
                $('#page-title5').animate({
                    'height': '25px',
                    'font-size': '24pt'
                }, 'fast');

                $('#page-title5 img').animate({
                    'height': '20px'
                }, 'fast', function () {
                    $('#page-title5 img.previous').animate({
                        'height': '25px'
                    }, 'fast');
                });
            }
            $('#menu3').slideToggle();
        }
    })());

    $('#addVocabulary, #addVocabulary1').click(function () {
        allClose(function () {
            $('#addVocabularyPage').slideDown('fast');
        });
    });

    $('#click_editVocabulary').click(function () {
        allClose(function () {
            $('#page-title4').html("<img src='images/Previous.png' class='previous' data-back='vocabularyContent' /> 編輯單字");
            $('#vocabularyName').attr('data-id', $("#page-title3").attr('data-id'));

            var category = JSON.parse(window.localStorage.WZ_categories);
            var categoryId = $('#page-title2').attr('data-id');
            var vocabularyName = category[categoryId].vocabulary[$("#page-title3").attr('data-id')].name;

            $('#vocabularyName').val(vocabularyName);
            $('#vocabularyMeaning').val(br2nl($("#content").html()));
            $('#addVocabularyPage').slideDown('fast');
        });
    });

    $('#vocabulary-list').on('click', 'li #editVocabularyIndex', function (event) {
        event.stopPropagation();
        $(this).attr('src', $(this).attr('src').split('.png')[0] + '-Click.png' );
        var that = this;
        allClose(function () {
            var vocabularyId = $(that).closest('li').data('id');
            $('#page-title4').html("<img src='images/Previous.png' class='previous' data-back='categoryContent' /> 編輯單字");
            $('#vocabularyName').attr('data-id', vocabularyId);

            var category = JSON.parse(window.localStorage.WZ_categories);
            var categoryId = $('#page-title2').attr('data-id');
            var vocabularyName = category[categoryId].vocabulary[vocabularyId].name;
            var vocabularyMeaning = category[categoryId].vocabulary[vocabularyId].meaning;

            $('#vocabularyName').val(vocabularyName);
            $('#vocabularyMeaning').val(vocabularyMeaning);
            $('#addVocabularyPage').slideDown('fast');
            $(that).attr('src', $(that).attr('src').split('-Click.png')[0] + '.png');
        });
    });
    
    $('#deleteCategory').click(function () {
        if (confirm('確定刪除此分類？')) {
            var categoryId = $('#page-title2').attr('data-id');
            var category = JSON.parse(window.localStorage.WZ_categories);
            category.splice( parseInt(categoryId), 1 );
            window.localStorage.WZ_categories = JSON.stringify(category);
            resetCategoryList();

            allClose(function () {
                $('#index').slideDown('fast');
            });
        }
    });

    $('#category-list').on('click', 'li #deleteCategoryIndex', function (event) {
        event.stopPropagation();
        $(this).attr('src', $(this).attr('src').split('.png')[0] + '_Click.png');
        if (confirm('確定刪除此分類？')) {
            var categoryId = $(this).closest('li').data('id');
            var category = JSON.parse(window.localStorage.WZ_categories);
            category.splice(parseInt(categoryId), 1);
            window.localStorage.WZ_categories = JSON.stringify(category);
            resetCategoryList();

            allClose(function () {
                $('#index').slideDown('fast');
            });
        }
        $(this).attr('src', $(this).attr('src').split('_Click.png')[0] + '.png');
    });

    $('#deleteVocabulary').click(function () {
        if (confirm('確定刪除此單字？')) {
            var categoryId = $('#page-title2').attr("data-id");
            var category = JSON.parse(window.localStorage.WZ_categories);
            var vocabularyId = $('#page-title3').attr("data-id");
            category[categoryId].vocabulary.splice(parseInt(vocabularyId), 1);
            window.localStorage.WZ_categories = JSON.stringify(category);
            resetVocabularyList();

            allClose(function () {
                $('#categoryContent').slideDown('fast');
            });
        }
    });

    $('#vocabulary-list').on('click', 'li #deleteVocabularyIndex', function (event) {
        event.stopPropagation();
        $(this).attr('src', $(this).attr('src').split('.png')[0] + '_Click.png');
        if (confirm('確定刪除此單字？')) {
            var categoryId = $('#page-title2').data("id");
            var category = JSON.parse(window.localStorage.WZ_categories);
            var vocabularyId = $(this).closest('li').data("id");
            category[categoryId].vocabulary.splice(parseInt(vocabularyId), 1);
            window.localStorage.WZ_categories = JSON.stringify(category);
            resetVocabularyList();

            allClose(function () {
                $('#categoryContent').slideDown('fast');
            });
        }
        $(this).attr('src', $(this).attr('src').split('_Click.png')[0] + '.png');
    });

    $('#addVocabularyForm').submit(function () {
        var dataId = $('#vocabularyName').attr("data-id");
        var promptString;

        if (dataId === "") promptString = '確定新增此單字？';
        else promptString = '確定修改此單字？'

        if (confirm(promptString)) {
            var navTo = $('#addVocabularyPage').find('.previous').data('back');
            var categoryId = $('#page-title2').attr("data-id");
            var vocabularyName = $('#vocabularyName').val();
            var vocabularyMeaning = $('#vocabularyMeaning').val();
            
            modifyVocabulary(vocabularyName, vocabularyMeaning, categoryId, dataId);
            resetVocabularyList();

            $('#page-title3').html(vocabularyNamePreparser(vocabularyName));
            $('#page-title3').data('id', dataId);
            $('#content').html(vocabularyMeaning);

            allClose(function () {
                $('#'+navTo).slideDown('fast');
            });
        }
        return false;
    });

    $('#revertContent').click(function () {
        $('#page-title2').click();
        WZ_setting = JSON.parse(window.localStorage.WZ_setting)
        WZ_setting.revert = !WZ_setting.revert;
        window.localStorage.WZ_setting = JSON.stringify(WZ_setting);

        resetVocabularyList();

    });

    $('#openAllVocabulary').click(function () {
        $('#page-title2').click();
        WZ_setting = JSON.parse(window.localStorage.WZ_setting)
        WZ_setting.vocabularyDisplay = true;
        window.localStorage.WZ_setting = JSON.stringify(WZ_setting);

        resetVocabularyList();
    });

    $('#closeAllVocabulary').click(function () {
        $('#page-title2').click();
        WZ_setting = JSON.parse(window.localStorage.WZ_setting)
        WZ_setting.vocabularyDisplay = false;
        window.localStorage.WZ_setting = JSON.stringify(WZ_setting);

        resetVocabularyList();
    });

    $('#category-list').on('click', 'li', function () {
        var categoryId = $(this).attr("data-id");
        var category = JSON.parse(window.localStorage.WZ_categories);
        var categoryName = category[categoryId].name;
        $('#page-title2').html('<img src="images/Previous.png" class="previous" data-back="index" /> ' + 
            categoryName + ' <img src="images/Arrowhead-Down-01.png" />');
        $('#page-title2').attr("data-id", categoryId);
        var vocabulary = category[categoryId].vocabulary;

        resetVocabularyList();

        allClose(function () {
            $('#categoryContent').slideDown('fast');
        });
    });

    $('#vocabulary-list').on("click", "li", function () {
        var categoryName = $('#page-title2').html();
        var categoryId = $('#page-title2').attr("data-id");

        var vocabularyId = $(this).attr("data-id");
        var category = JSON.parse(window.localStorage.WZ_categories);
        var vocabulary = category[categoryId].vocabulary[vocabularyId].meaning;
        var vocabularyName = category[categoryId].vocabulary[vocabularyId].name;

        $('#page-title3').html(vocabularyNamePreparser(vocabularyName));
        $('#page-title3').attr("data-id", vocabularyId);
        $('#content').html(vocabulary);

        allClose(function () {
            $('#vocabularyContent').slideDown('fast');
        });
    });

    $('#page-title').on("click", (function(){
        var toggle = false;
        return function () {
            toggle = !toggle;
            if (toggle) {
                $('#page-title').animate({
                    'height': '20px',
                    'font-size': '19pt'
                }, 'fast');

                $('#page-title img').animate({
                    'height': '16px'
                }, 'fast', function () {
                    $('#page-title img.previous').animate({
                        'height': '20px'
                    }, 'fast');
                });
            }
            else {
                $('#page-title').animate({
                    'height': '25px',
                    'font-size': '24pt'
                }, 'fast');

                $('#page-title img').animate({
                    'height': '20px'
                }, 'fast', function () {
                    $('#page-title img.previous').animate({
                        'height': '25px'
                    }, 'fast');
                });
            }
            $('#menu').slideToggle();
        }
    })());

    $('#page-title2').on('click', (function () {
        var toggle = false;
        return function () {
            toggle = !toggle;
            if (toggle) {
                $('#page-title2').animate({
                    'font-size': '19pt'
                }, 'fast');

                $('#page-title2 img').animate({
                    'height': '16px'
                }, 'fast', function () {
                    $('#page-title2 img.previous').animate({
                        'height': '20px'
                    }, 'fast');
                });
                
            }
            else {
                $('#page-title2').animate({
                    'font-size': '24pt'
                }, 'fast');

                $('#page-title2 img').animate({
                    'height': '20px'
                }, 'fast', function () {
                    $('#page-title2 img.previous').animate({
                        'height': '25px'
                    }, 'fast');
                });
            }
            $('#menu2').slideToggle();
        }
    })());

    Init();
});