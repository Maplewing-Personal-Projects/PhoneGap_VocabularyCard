$(function () {
    var initData = {
        Food: {
            apple: "(n.) 蘋果",
            banana: "(n.) 香蕉"
        },
        Sport: {
            jog: "(vi.) 慢跑"
        }
    };

    function nl2br(str) {
        return str.replace(/([^>])\n/g, '$1<br/>\n');
    }

    var Init = function () {
        var category;
        if (window.localStorage && window.localStorage.categories) {
            category = JSON.parse(window.localStorage.categories);
        }
        else if (window.localStorage) {
            window.localStorage.categories = JSON.stringify(initData);
            category = JSON.parse(window.localStorage.categories);
        }
        else {
            category = initData;
        }
        for (var categoryName in category) {
            $("#category-list").html($("#category-list").html() + "<li>" + categoryName + "</li>");
        }

    };

    var resetCategoryList = function () {
        $("#category-list").html('');
        var category = JSON.parse(window.localStorage.categories);
        for (var categoryName in category) {
            $("#category-list").html($("#category-list").html() + "<li>" + categoryName + "</li>");
        }
        clickCategoryEvent();
    }

    var resetVocabularyList = function () {
        $("#vocabulary-list").html('');
        var category = JSON.parse(window.localStorage.categories);
        var categoryName = $('#page-title2').html();
        for (var vocabularyName in category[categoryName]) {
            $("#vocabulary-list").html($("#vocabulary-list").html() + "<li>" + vocabularyName + "</li>");
        }
        clickVocabularyEvent();
    }

    $('#addCategoryForm').submit(function () {
        var value = $('#category').val();
        if (window.localStorage.categories) {
            var category = JSON.parse(window.localStorage.categories);
            if (!category[value])
                category[value] = {};
            window.localStorage.categories = JSON.stringify(category);
        }

        resetCategoryList();

        $('#addCategory').slideUp('slow', function () {
            $('#index').slideDown('slow');
        });

        return false;
    });

    var allClose = function (callback) {
        $('#about').slideUp('slow', function () {
            $('#addCategory').slideUp('slow', function () {
                $('#addVocabularyPage').slideUp('slow', function () {
                    $('#vocabularyContent').slideUp('slow', function () {
                        $('#categoryContent').slideUp('slow', function () {
                            $('#index').slideUp('slow', function () {
                                callback();
                            });
                        });
                    });
                });
            });
        });
    };

    $('#programName').click(function () {
        allClose(function () {
            $('#about').slideDown('slow');
        });
    });

    $('#click_addCategory').click(function () {
        allClose(function () {
            $('#addCategory').slideDown('slow');
        });

    });

    $('#click_index, #click_index1, #click_index2').click(function () {
        allClose(function () {
            $('#index').slideDown('slow');
        });
    });

    $('#click_category, #click_category1').click(function () {
        allClose(function () {
            $('#categoryContent').slideDown('slow');
        });
    });

    $('#addVocabulary').click(function () {
        allClose(function () {
            $('#addVocabularyPage').slideDown('slow');
        });
    });

    $('#deleteCategory').click(function () {
        if (confirm('確定刪除此分類？')) {
            var categoryName = $('#page-title2').html();
            var category = JSON.parse(window.localStorage.categories);
            delete category[categoryName];
            window.localStorage.categories = JSON.stringify(category);
            resetCategoryList();

            allClose(function () {
                $('#index').slideDown('slow');
            });
        }
    });

    $('#deleteVocabulary').click(function () {
        if (confirm('確定刪除此單字？')) {
            var categoryName = $('#page-title2').html();
            var category = JSON.parse(window.localStorage.categories);
            var VocabularyName = $('#page-title3').html();
            delete category[categoryName][VocabularyName];
            window.localStorage.categories = JSON.stringify(category);
            resetVocabularyList();

            allClose(function () {
                $('#categoryContent').slideDown('slow');
            });
        }
    });

    $('#addVocabularyForm').submit(function () {
        if (confirm('確定新增此單字？')) {
            var categoryName = $('#page-title2').html();
            var category = JSON.parse(window.localStorage.categories);
            var vocabularyName = $('#vocabularyName').val();
            var vocabularyMeaning = $('#vocabularyMeaning').val();
            var vocabulary = category[categoryName][vocabularyName];
            category[categoryName][vocabularyName] = nl2br(vocabularyMeaning);

            window.localStorage.categories = JSON.stringify(category);

            resetVocabularyList();

            allClose(function () {
                $('#categoryContent').slideDown('slow');
            });
        }
        return false;
    });

    Init();


    var clickCategoryEvent = function () {
        $('#category-list li').on('click', function () {
            var categoryName = $(this).html();
            var category = JSON.parse(window.localStorage.categories);
            $('#page-title2').html(categoryName);
            var vocabulary = category[categoryName];
            $('#vocabulary-list').html('');
            for (var vocabularyName in vocabulary) {
                $('#vocabulary-list').html($('#vocabulary-list').html() + '<li>' + vocabularyName + '</li>');
            }

            clickVocabularyEvent();

            allClose(function () {
                $('#categoryContent').slideDown('slow');
            });
        });
    };

    var clickVocabularyEvent = function () {
        $('#vocabulary-list li').on("click", function () {
            var categoryName = $('#page-title2').html();
            var vocabularyName = $(this).html();
            var category = JSON.parse(window.localStorage.categories);
            var vocabulary = category[categoryName][vocabularyName];


            $('#page-title3').html(vocabularyName);
            $('#content').html(vocabulary);

            allClose(function () {
                $('#vocabularyContent').slideDown('slow');
            });
        });
    }

    clickCategoryEvent();
});