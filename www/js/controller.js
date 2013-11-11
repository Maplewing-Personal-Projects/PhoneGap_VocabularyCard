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
                revert: false
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

        for (var i = 0 ; i < category.length ; ++i) {
            $("#category-list").html($("#category-list").html() + "<li data-id='" + i + "'>" + category[i].name + "</li>");
        }

        sortCategory();
    };

    var resetCategoryList = function () {
        $("#category-list").html('');
        var category = JSON.parse(window.localStorage.WZ_categories);
        for (var i = 0 ; i < category.length ; ++i) {
            $("#category-list").html($("#category-list").html() + "<li data-id='" + i + "'>" + category[i].name + "</li>");
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
        var revert = JSON.parse(window.localStorage.WZ_setting).revert;
        for (var i = 0 ; i < category[categoryId].vocabulary.length; ++i) {
            if (revert) {
                $("#vocabulary-list").html($("#vocabulary-list").html() + "<li data-id='" + i + "'>" + category[categoryId].vocabulary[i].meaning + "</li>");
            }
            else {
                $("#vocabulary-list").html($("#vocabulary-list").html() + "<li data-id='" + i + "'>" + vocabularyNamePreparser(category[categoryId].vocabulary[i].name) + "</li>");
            }
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
        $('#importPage').slideUp('fast', function () {
            $('#exportPage').slideUp('fast', function () {
                $('#about').slideUp('fast', function () {
                    $('#addCategory').slideUp('fast', function () {
                        $('#click_index').html("返回分類列表");
                        $('#category').val("");
                        $('#category').attr("data-id", "");
                        $('#page-title1').html("<img src='images/Previous.png' class='previous' id='click_index' /> 新增分類");

                        $('#addVocabularyPage').slideUp('fast', function () {
                            $('#click_category').html("返回分類");
                            $('#vocabularyName').val("");
                            $('#vocabularyName').attr("data-id", "");
                            $('#vocabularyMeaning').val("");
                            $('#page-title4').html("<img src='images/Previous.png' class='previous' id='click_category' /> 新增單字");

                            $('#vocabularyContent').slideUp('fast', function () {
                                $('#page-title5').css({
                                    'height': '25px',
                                    'font-size': '24pt'
                                });
                                $('#menu3').slideUp();

                                $('#categoryContent').slideUp('fast', function () {
                                    $('#page-title2').css({
                                        'height': '25px',
                                        'font-size': '24pt'
                                    });
                                    $('#menu2').slideUp();

                                    $('#index').slideUp('fast', function () {
                                        $('#page-title').css({
                                            'height': '25px',
                                            'font-size': '24pt'
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
        modifyCategory(value, dataId);

        resetCategoryList();
        allClose(function(){
            if (dataId === "") $('#index').slideDown('fast');
            else {
                $('#page-title2').html(value);
                $('#categoryContent').slideDown('fast');
            }
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
            $('#page-title1').html("<img src='images/Previous.png' class='previous' id='click_index' /> 編輯分類");
            $('#category').val(categoryName);
            $('#category').attr('data-id', $("#page-title2").attr('data-id'));
            $('#addCategory').slideDown('fast');
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

    $('#click_index3, #click_index4').on("click", function () {
        $(this).attr('src', 'images/PreviousClick.png');
        var that = this;
        allClose(function () {
            $('#index').slideDown('fast');
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

    $('#page-title1').on('click', '#click_index', function () {
        $(this).attr('src', 'images/PreviousClick.png');
        var that = this;
        if ($('#category').attr("data-id") === "") {
            allClose(function () {
                $('#index').slideDown('fast');
                $(that).attr('src', 'images/Previous.png');
            });
        }
        else {
            allClose(function () {
                $('#categoryContent').slideDown('fast');
                $(that).attr('src', 'images/Previous.png');
            });
        }
    });

    $('#page-title2').on('click', '#click_index1', function (event) {
        $(this).attr('src', 'images/PreviousClick.png');
        event.stopPropagation();

        var that = this;
        allClose(function () {
            $('#index').slideDown('fast');
            $(that).attr('src', 'images/Previous.png');
        });
    });

    $('#page-title4').on('click', '#click_category', function () {
        $(this).attr('src', 'images/PreviousClick.png');

        var that = this;
        if ($('#vocabularyName').attr("data-id") === "") {
            allClose(function () {
                $('#categoryContent').slideDown('fast');
                $(that).attr('src', 'images/Previous.png');
            });
        }
        else {
            allClose(function () {
                $('#vocabularyContent').slideDown('fast');
                $(that).attr('src', 'images/Previous.png');
            });
        }
    });

    $('#click_category1').click(function (event) {
        $(this).attr('src', 'images/PreviousClick.png');
        event.stopPropagation();

        var that = this;
        allClose(function () {
            $('#categoryContent').slideDown('fast');
            $(that).attr('src', 'images/Previous.png');
        });
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
            }
            else {
                $('#page-title5').animate({
                    'height': '25px',
                    'font-size': '24pt'
                }, 'fast');
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
            $('#click_category').html("返回單字");
            $('#page-title4').html("編輯單字");
            $('#vocabularyName').attr('data-id', $("#page-title3").attr('data-id'));

            var category = JSON.parse(window.localStorage.WZ_categories);
            var categoryId = $('#page-title2').attr('data-id');
            var vocabularyName = category[categoryId].vocabulary[$("#page-title3").attr('data-id')].name;

            $('#vocabularyName').val(vocabularyName);
            $('#vocabularyMeaning').val(br2nl($("#content").html()));
            $('#addVocabularyPage').slideDown('fast');
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

    $('#addVocabularyForm').submit(function () {
        var dataId = $('#vocabularyName').attr("data-id");
        var promptString;

        if (dataId === "") promptString = '確定新增此單字？';
        else promptString = '確定修改此單字？'

        if (confirm(promptString)) {
            var categoryId = $('#page-title2').attr("data-id");
            var vocabularyName = $('#vocabularyName').val();
            var vocabularyMeaning = $('#vocabularyMeaning').val();
            
            modifyVocabulary(vocabularyName, vocabularyMeaning, categoryId, dataId);
            resetVocabularyList();

            allClose(function () {
                $('#categoryContent').slideDown('fast');
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


    $('#category-list').on('click', 'li', function () {
        var categoryName = $(this).html();
        var categoryId = $(this).attr("data-id");
        var category = JSON.parse(window.localStorage.WZ_categories);
        $('#page-title2').html('<img src="images/Previous.png" class="previous" id="click_index1" /> ' + 
            categoryName + ' <img src="images/Arrowhead-Down-01.png" />');
        $('#page-title2').attr("data-id", categoryId);
        var vocabulary = category[categoryId].vocabulary;

        $('#vocabulary-list').html('');
        var revert = JSON.parse(window.localStorage.WZ_setting).revert;
        for (var i = 0 ; i < category[categoryId].vocabulary.length; ++i) {
            if (revert) {
                $("#vocabulary-list").html($("#vocabulary-list").html() + "<li data-id='" + i + "'>" + category[categoryId].vocabulary[i].meaning + "</li>");
            }
            else {
                $("#vocabulary-list").html($("#vocabulary-list").html() + "<li data-id='" + i + "'>" + vocabularyNamePreparser(category[categoryId].vocabulary[i].name) + "</li>");
            }
        }

        sortVocabulary();

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
            }
            else {
                $('#page-title').animate({
                    'height': '25px',
                    'font-size': '24pt'
                }, 'fast');
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
                    'height': '20px',
                    'font-size': '19pt'
                }, 'fast');
            }
            else {
                $('#page-title2').animate({
                    'height': '25px',
                    'font-size': '24pt'
                }, 'fast');
            }
            $('#menu2').slideToggle();
        }
    })());

    Init();
});