/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        var db = window.openDatabase("test", "1.0", "TestDB", 1000000);
        db.transaction(populateDB, errorCB);
        db.transaction(queryDB, errorCB);

        // Save entered item to database
        $('#btnsave').click(function() {
            db.transaction(insertRow, errorCB, emptyFields);
            db.transaction(queryDB, errorCB);
        });       

        // Remove all
        $('#btnclear').click(function() {
            db.transaction(populateDB, errorCB);
            db.transaction(queryDB, errorCB);
        });       

        $("#regularList").on('click', 'button', function (e) {
            var recipeid = $(this).closest('div').attr("id");
            console.log("trying to delete " + recipeid)
            db.transaction(
               function(tx){
                   tx.executeSql('DELETE Recipe WHERE id=?', [recipeid]);
               },
               errorCB
            );

            db.transaction(queryDB, errorCB);   
        });

        $("#favoriteList").on('click', 'button', function (e) {
            var recipeid = $(this).closest('div').attr("id");
            console.log("trying to delete " + recipeid);
            db.transaction(
               function(tx){
                   tx.executeSql('DELETE Recipe WHERE id=?', [recipeid]);
               },
               errorCB
            );

            db.transaction(queryDB, errorCB);   
        });

        $("#regularList").on('click', 'a', function (e) {
            var recipeid = $(this).closest('div').attr("id");
            var fav = $('#'+recipeid+' .content_favorite').text();
            console.log(fav);
            if (fav == 0){
                db.transaction(
                    function(tx){
                        tx.executeSql('UPDATE Recipe SET favorite = ? WHERE id = ?', [1, recipeid]);
                    },
                    errorCB
                );
            }
            else if (fav == 1){
                db.transaction(
                    function(tx){
                        tx.executeSql('UPDATE Recipe SET favorite = ? WHERE id = ?', [0, recipeid]);
                    },
                    errorCB
                );
            }

            db.transaction(queryDB, errorCB);   
        });

        $("#favoriteList").on('click', 'a', function (e) {
            var recipeid = $(this).closest('div').attr("id");
            var fav = $('#'+recipeid+' .content_favorite').text();
            console.log(fav);
            if (fav == 0){
                db.transaction(
                    function(tx){
                        tx.executeSql('UPDATE Recipe SET favorite = ? WHERE id = ?', [1, recipeid]);
                    },
                    errorCB
                );
            }
            else if (fav == 1){
                db.transaction(
                    function(tx){
                        tx.executeSql('UPDATE Recipe SET favorite = ? WHERE id = ?', [0, recipeid]);
                    },
                    errorCB
                );
            }

            db.transaction(queryDB, errorCB);   
        });

    },

};


   // Create table and populate it with some demodata
    function populateDB(tx) {
        tx.executeSql('DROP TABLE IF EXISTS Recipe');
        tx.executeSql('CREATE TABLE IF NOT EXISTS Recipe (id INTEGER PRIMARY KEY, name, text, time, favorite BOOLEAN DEFAULT FALSE)');
        tx.executeSql('INSERT INTO Recipe (name, text, time, favorite) VALUES ("Rocky Brownies", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ac laoreet ex. In posuere quis sapien a efficitur. Nulla quis finibus elit, ac pharetra lectus. Pellentesque pharetra justo vitae augue aliquam faucibus. Fusce non vulputate erat, ut placerat neque. Maecenas commodo ac urna sed placerat.", "2 hours", 1)');
        tx.executeSql('INSERT INTO Recipe (name, text, time, favorite) VALUES ("Egg Fried Rice", "Quisque quam risus, facilisis eu elit sed, suscipit dictum quam. In sagittis consectetur dolor, luctus molestie sem dictum et. Aenean faucibus ipsum id lorem tincidunt, at pharetra quam accumsan. Integer bibendum convallis nisl. Aenean nec ullamcorper nisl, a ornare justo.", "30 minutes", 0)');
        tx.executeSql('INSERT INTO Recipe (name, text, time, favorite) VALUES ("Miso soup", "Vestibulum venenatis fringilla felis, sit amet porta turpis vestibulum vel. Pellentesque ut hendrerit quam. Nullam sit amet elit dui. Vivamus eget ultricies tellus, lacinia egestas mauris. Donec sodales magna vitae faucibus vulputate.", "15 minutes", 0)');
    }

   // Insert new todo 
    function insertRow(tx) {
        var favorite = $("#radio_true").is(':checked') ? 1 : 0;

        console.log(favorite);
        tx.executeSql('INSERT INTO Recipe (name, text, time, favorite) VALUES (?, ?, ?, ?)', [$('#name').val(),  $('#text').val(), $('#time').val(), favorite]);
    }

    // Fetch all recipes from DB
    function queryDB(tx) {
        tx.executeSql('SELECT * FROM Recipe', [], querySuccess, errorCB);
    }

    function getSingleRow(id) {
        tx.executeSql('SELECT * FROM Recipe WHERE id = ?', [id], queryResult, errorCB);
    }


 
    // Populate listview
    function querySuccess(tx, results) {
        var len = results.rows.length;
        console.log(len + " rows found.");
        $('#favoriteList').empty(); // remove all rows
        $('#regularList').empty(); // remove all rows
        $('#searchList').empty(); // remove all rows
        for (var i = 0; i < len; i++){
            var f = results.rows.item(i).favorite;
            var rAppend = results.rows.item(i).id + "' class='recipe' ><span class='content_name'>" + results.rows.item(i).name + "</span>" +
                    "<span class='content_time'>" + results.rows.item(i).time + "</span><br> " + 
                    "<span class='content_text'>"+ results.rows.item(i).text + "</span><br> " + 
                    "<span class='content_favorite' style='display: none'>" + results.rows.item(i).favorite +"</span> <a href='' class='favorite ui-btn ui-corner-all'>Favorite</a> <button href='' class='ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext deleteLink'></button>";
            var fAppend = results.rows.item(i).id + "' class='recipe' ><span class='content_name'>" + results.rows.item(i).name + "</span>" +
                    "<span class='content_time'>" + results.rows.item(i).time + "</span><br> " + 
                    "<span class='content_text'>"+ results.rows.item(i).text + "</span><br> " + 
                    "<span class='content_favorite' style='display: none'>" + results.rows.item(i).favorite +"</span> <a href='' class='favorite ui-btn ui-corner-all'>Unfavorite</a> <button href='' class='ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext deleteLink'></button>";
            if (f == 0){
                $('#regularList').append("<div id='" + rAppend + "</div>");
                $('#searchList').append("<li id='" + rAppend + "</li>")
            }
            else if (f == 1){
                $('#favoriteList').append("<div id='" + fAppend + "</div>");
                $('#searchList').append("<li id='" + fAppend + "</li>")
            }
        }
        
        // Always refresh listview after updating listview with JS
        $('#regularList').listview('refresh');
        $('#favoriteList').listview('refresh');
    }
    

    function queryResult(tx,results)
    {
        var len = results.rows.length;
        if(len>0)
        {
            alert(results.rows.item(0)['name']);
        }
        $('#details').append("<span id='recipeName'>" + results.rows.item(0).name + "</span> <br>" +
                            "<span id='recipeServing'>" + results.rows.item(0).text + "</span> <br>" +
                            "<span id='recipeTime'>" + results.rows.item(0).time + "</span> <br>" + 
                            "<span id='recipeFavorite'>" + results.rows.item(0).favorite + "</span>");

    }

     // Transaction error callback
    function errorCB(err) {
        console.log("Error processing SQL: "+ err.code);
    }
    
    function onSuccessExecuteSql( tx, results ){
        console.log( 'Execute SQL completed' )
    }

    function emptyFields() {
         $('#name').val('');
        $('#text').val('');
        $('#time').val('');
        $('#favorite').val('');
    }


 $(document).on("pagecreate", function() {
            $(document).on("pagecontainershow", function(){
                $(".ui-content").height(getRealContentHeight());
            })

            $(window).on("resize orientationchange", function(){
                $(".ui-content").height(getRealContentHeight());
            })
            
            function getRealContentHeight() {
                var activePage = $.mobile.pageContainer.pagecontainer("getActivePage"),
                screen = $.mobile.getScreenHeight(),
                header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight() - 1 : $(".ui-header").outerHeight(),
                footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight(),
                contentMargins = $(".ui-content", activePage).outerHeight() - $(".ui-content", activePage).height();
                var contentHeight = screen - header - footer - contentMargins;    
                
                return contentHeight;
            }
        });
$(document).one("pagebeforecreate", function () {
    
            $( "[data-role='header']" ).enhanceWithin().toolbar(); // Koska on sisältöä
            $( "[data-role='footer']" ).toolbar();  // WP ei osaa asettaa oikein
        
            $("#popupMenu").enhanceWithin().popup(); // Koska on sisältöä   
        });
                
$(document).on("pagecreate", function() {

    $(document).on("pagecontainershow", function(){
        $(".ui-content").height(getRealContentHeight());
    })

    $(window).on("resize orientationchange", function(){
        $(".ui-content").height(getRealContentHeight());
    })
    
    function getRealContentHeight() {
        var activePage = $.mobile.pageContainer.pagecontainer("getActivePage"),
            screen = $.mobile.getScreenHeight(),
            header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight() - 1 : $(".ui-header").outerHeight(),
            footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight(),
            contentMargins = $(".ui-content", activePage).outerHeight() - $(".ui-content", activePage).height();
        
        var contentHeight = screen - header - footer - contentMargins;  
        
        return contentHeight;
    }
    
});

$(document).on("pagecreate", "#itemPage", function() {
            console.log("itempage created for id = ");
            var onSuccess = function(position) {
                
            };

            function onError(error) {
                alert('code: '    + error.code    + '\n' +
                      'message: ' + error.message + '\n');
            }
            
});
