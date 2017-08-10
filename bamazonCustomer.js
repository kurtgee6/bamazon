var mysql = require("mysql");
var inquirer = require("inquirer");
var productItem;
////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////// create the connection information for the sql database ////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "oranges",
    database: "bamazon_db"
});

////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////// connect to the mysql server and sql database ///////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////


connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made
    start();
});


////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// start function //////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

function start() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        inquirer
            .prompt([{
                    name: "yesOrNo",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < res.length; i++) {
                            choiceArray.push(res[i].product_name);
                        }
                        return choiceArray;
                    },
                    message: "What Would you like to buy?"
            },
                {
                    name: "question",
                    type: "input",
                    message: "How many would you like to buy?",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
            }])
            .then(function (answer) {

                productItem;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].product_name === answer.yesOrNo) {
                        productItem = res[i];
                    }
                }


                connection.query("SELECT * FROM products WHERE stock_quantity = ' " + productItem + " ' ", function (err, res) {
                    if (err) throw err;

                    if (parseInt(answer.question) <= productItem.stock_quantity) {

                        console.log("\n");
                        console.log("Congratulations, Your order was succesful! " +
                            "\nYour total for today is: " + "" +
                            "\nBuy something else, there's more to want!");
                        console.log("\n");

                        connection.query("UPDATE products SET stock_quantity = " + answer.question + " WHERE item_id = " + productItem.item_id + " ", function (err, res) {
                            if (err) throw err;
                            if (parseInt(answer.question) > 0) {
                                console.log("good");
                            } else {
                                console.log("wrong");
                            }
                        });

                    } else {

                        console.log("\n");
                        console.log("Sorry, Insufficient quantity! Buy something else please :)");
                        console.log("\n");

                    }
                });

                start();

            });
    });


};
