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

         // Delete one todo
        $("#datalist").on('click', 'li', function (e) {
            var todoid = $(this).attr("id");
            
            db.transaction(
               function(tx){
                   tx.executeSql('SELECT * FROM Recipe WHERE id=?', [recipeid]);
                   
               },
               errorCB
            );

            db.transaction(queryDB, errorCB);   
        });

        // $("#datalist").on('click', 'li', function (e) {
        //     var todoid = $(this).attr("id");
            
        //     db.transaction(
        //        function(tx){
        //            tx.executeSql('DELETE FROM Recipe WHERE id=?', [todoid]);
        //        },
        //        errorCB
        //     );

        //     db.transaction(queryDB, errorCB);   
        // });

    },

};

   // Create table and populate it with some demodata
    function populateDB(tx) {
        tx.executeSql('DROP TABLE IF EXISTS Recipe');
        tx.executeSql('CREATE TABLE IF NOT EXISTS Recipe (id INTEGER PRIMARY KEY, name, serving, time, favorite BOOLEAN DEFAULT FALSE)');
        tx.executeSql('INSERT INTO Recipe (name, serving, time, favorite) VALUES ("Rocky Brownies", "3", "2 hours", 1)');
        tx.executeSql('INSERT INTO Recipe (name, serving, time, favorite) VALUES ("Egg Fried Rice", "2", "30 minutes", 0)');
        tx.executeSql('INSERT INTO Recipe (name, serving, time, favorite) VALUES ("Miso soup", "4 bowls", "15 minutes", 0)');
    }

   // Insert new todo 
    function insertRow(tx) {
        var favorite = $("#radio_true").is(':checked') ? 1 : 0;

        console.log(favorite);
        tx.executeSql('INSERT INTO Recipe (name, serving, time, favorite) VALUES (?, ?, ?, ?)', [$('#name').val(),  $('#serving').val(), $('#time').val(), favorite]);
    }

    // Fetch all todos from DB
    function queryDB(tx) {
        tx.executeSql('SELECT * FROM Recipe', [], querySuccess, errorCB);
    }

    // function findById(tx) {
    //     tx.executeSql('SELECT * FROM Recipe WHERE id ='$('#id'), [], querySuccess, errorCB);
    // }
 
    // Populate listview
    function querySuccess(tx, results) {
        var len = results.rows.length;
        console.log(len + " rows found.");
        $('#datalist').empty(); // remove all rows
        for (var i = 0; i < len; i++){
            $('#datalist').append("<li data-icon='delete' id='" +  results.rows.item(i).id + "'><a href='#'>" + results.rows.item(i).name + " " + results.rows.item(i).serving + " " + results.rows.item(i).time + " " + results.rows.item(i).favorite + "</a></li>");
        }
        
        // Always refresh listview after updating listview with JS
        $('#datalist').listview('refresh');
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
        $('#serving').val('');
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

$(document).on("pagecreate", "#itemPage", function(id) {
            console.log("itempage created for id = " +id);
            var onSuccess = function(position) {
                
            };

            function onError(error) {
                alert('code: '    + error.code    + '\n' +
                      'message: ' + error.message + '\n');
            }
            
        })