// Import Library
const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');

// Init Express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('static'));
app.use(session({ secret: "abcd", resave: false }));

// Init Database Connection
const connection = mysql.createConnection({
    // connectionlimit:10,
    host: 'localhost',
    user: 'root',
    password: '1234567',
    database: 'projectsushi'
})
connection.connect();

// Home
app.get("/home", (req, res) => {
    if (req.session.isLoggedIn) {
        res.render("front");
    } else {
        res.render("login", { error: "ไม่พบ session กรุณาล็อกอิน" });
    }
});
// End Home

// Login
app.get("/login", (req, res) => {
    res.render("login", { error: "" });
});

app.post("/submit_order", (req, res) => {
    console.log(req.body);
    const sql = `INSERT INTO order_sushi(table_number, type_id, ot_id, amount, sauce_id, sid_id) 
    VALUES (?, ?, ?, ?, ?, ?)`;
    const sql2 = `INSERT INTO room(table_number, type_id, ot_id, amount, sauce_id, sid_id,price) 
    VALUES (?, ?, ?, ?, ?, ?,40)`;
    connection.query(sql, [

        Number(req.body.table_number),
        Number(req.body.type_sushi),
        Number(req.body.topping),
        Number(req.body.quantity),
        Number(req.body.sauce),
        Number(req.body.Side_dishs)

    ], (err, result) => {
        if (err) {
            console.err(err.message);
            res.send("error");
        } else {


            connection.query(sql2, [

                Number(req.body.table_number),
                Number(req.body.type_sushi),
                Number(req.body.topping),
                Number(req.body.quantity),
                Number(req.body.sauce),
                Number(req.body.Side_dishs)

            ], (err, result) => {
                if (err) {
                    console.err(err.message);
                    res.send("error");
                } else {
                    connection.query(`SELECT * FROM topping`, (error, results2, fields) => {
                        if (error) throw error;
                        connection.query(`SELECT * FROM supply`, (error, results3, fields) => {
                            if (error) throw error;
                            connection.query(`SELECT * FROM sauce`, (error, results4, fields) => {
                                if (error) throw error;
                                connection.query(`SELECT * FROM side_dishs`, (error, results5, fields) => {
                                    if (error) throw error;
                                    connection.query(`SELECT * FROM type_sushi`, (error, results6, fields) => {
                                        if (error) throw error;
                                        connection.query(`SELECT
                                        room.table_number, 
                                        type_sushi.type, 
                                        sauce.sauce_name, 
                                        side_dishs.sid_name, 
                                        topping.ot_name, 
                                        room.amount, 
                                        room.price
                                    FROM
                                        room
                                        LEFT JOIN
                                        sauce
                                        ON 
                                            room.sauce_id = sauce.sauce_id
                                        LEFT JOIN
                                        side_dishs
                                        ON 
                                            room.sid_id = side_dishs.sid_id
                                        LEFT JOIN
                                        topping
                                        ON 
                                            room.ot_id = topping.ot_id AND
                                            room.price = topping.price
                                        LEFT JOIN
                                        type_sushi
                                        ON 
                                            room.type_id = type_sushi.type_id WHERE table_number=${req.body.table_number}`, (error, results7, fields) => {
                                            if (error) throw error;
                                            res.render("front", {
                                                table_number: req.body.table_number,
                                                topping: results2,
                                                supply: results3,
                                                sauce: results4,
                                                side_dishs: results5,
                                                type_sushi: results6,
                                                bill_sushi: results7,
                                            });
                                        })
                                    })
                                })
                            })
                        })
                    })
                }
            })
        }
    })



})
app.delete("/cook/:productId", (req, res) => {
    const id = req.params.productId
    
    connection.query(`DELETE FROM order_sushi WHERE order_id=${id}`, (err, result) => {
        console.log("suc")
        if (err) { res.send("error"); } else { res.send("deleted"); }
    })

})
app.delete("/bill/delete/:productId", (req, res) => {
    const id = req.params.productId
    connection.query(`DELETE FROM room WHERE table_number=${id}`, (err, result) => {
        console.log("suc")
        if (err) { res.send("error"); } else { res.send("deleted"); }
    })

})
app.delete("/api/supply/:productId", (req, res) => {
    const id = req.params.productId
    connection.query(`DELETE FROM supply WHERE id=${id}`, (err, result) => {
        console.log("suc")
        if (err) { res.send("error"); } else { res.send("deleted"); }
    })

})
app.get("/api/supply", (req, res) => {
    connection.query("SELECT * FROM supply", (err, results) => {
        //res.json(results)
        res.json(results)
        if (err) throw err;
    })


})
// Login API
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    connection.query(`SELECT * FROM user WHERE user_name='${username}'`, (error, results, fields) => {
        if (error) throw error;

        if (results.length == 0) {
            // Not Found User
            res.render("login", { error: "invalid username or password" });
            return;
        }

        if (results[0].password == password) {
            // IF Input Password == Password In Database
            req.session.isLoggedIn = true;
            switch (results[0].user_type) {
                case 1:
                    connection.query(`SELECT * FROM topping`, (error, results2, fields) => {
                        if (error) throw error;
                        connection.query(`SELECT * FROM supply`, (error, results3, fields) => {
                            if (error) throw error;
                            connection.query(`SELECT * FROM sauce`, (error, results4, fields) => {
                                if (error) throw error;
                                connection.query(`SELECT * FROM side_dishs`, (error, results5, fields) => {
                                    if (error) throw error;
                                    connection.query(`SELECT * FROM type_sushi`, (error, results6, fields) => {
                                        if (error) throw error;
                                        connection.query(`SELECT
                                        room.table_number, 
                                        type_sushi.type, 
                                        sauce.sauce_name, 
                                        side_dishs.sid_name, 
                                        topping.ot_name, 
                                        room.amount, 
                                        room.price
                                    FROM
                                        room
                                        LEFT JOIN
                                        sauce
                                        ON 
                                            room.sauce_id = sauce.sauce_id
                                        LEFT JOIN
                                        side_dishs
                                        ON 
                                            room.sid_id = side_dishs.sid_id
                                        LEFT JOIN
                                        topping
                                        ON 
                                            room.ot_id = topping.ot_id AND
                                            room.price = topping.price
                                        LEFT JOIN
                                        type_sushi
                                        ON 
                                            room.type_id = type_sushi.type_id WHERE table_number=${results[0].table_number}`, (error, results7, fields) => {
                                            if (error) throw error;
                                        res.render("front", {
                                            table_number: results[0].table_number,
                                            topping: results2,
                                            supply: results3,
                                            sauce: results4,
                                            side_dishs: results5,
                                            type_sushi: results6,
                                            bill_sushi: results7,
                                        });
                                    })
                                })
                            })
                        })
                    })
                })
                    break;
                case 2:
                    connection.query(`SELECT
            topping.ot_name, 
            sauce.sauce_name, 
            side_dishs.sid_name, 
            type_sushi.type, 
            order_sushi.*
        FROM
            order_sushi
            LEFT JOIN
            sauce
            ON 
                order_sushi.sauce_id = sauce.sauce_id
            LEFT JOIN
            side_dishs
            ON 
                order_sushi.sid_id = side_dishs.sid_id
            LEFT JOIN
            topping
            ON 
                order_sushi.ot_id = topping.ot_id
            LEFT JOIN
            type_sushi
            ON 
                order_sushi.type_id = type_sushi.type_id `,
                        (error, results, fields) => {
                            if (error) throw error;
                            console.log(results)
                            res.render("cook", { cookre: results })
                            console.log(results)
                        })

                    break;
                case 3:

                    res.render("bill", {
                        bill: [

                        ]
                    });
                    break;
                case 4:
                    res.render("admin");
                    break;
            }
        } else {
            // Invalid Password
            res.render("login", { error: "invalid username or password" });
            return;
        }
    });
});
// End Login

//admin
app.get("/admin", (req, res) => {
    if (req.session.isLoggedIn) {
        res.render("admin");
    } else {
        res.render("login", { error: "ไม่พบ session กรุณาล็อกอิน" });
    }
});
app.post("/api/supply", (req, res) => {
    console.log(req.body);

    const productId = req.body.id;
    const productName = req.body.name;
    const productAmount = req.body.amount;

    connection.query('SELECT * FROM supply WHERE id = ?', productId, (err, rows) => {
        if (err) {
            console.error(err.message);
            res.send("error");
        } else {
            if (rows.length) {
                const updatedAmount = parseInt(rows[0].amount) + parseInt(productAmount);
                connection.query('UPDATE supply SET amount = ? WHERE id = ?', [updatedAmount, productId], (updateErr, updateResult) => {
                    if (updateErr) {
                        console.error(updateErr.message);
                        res.send("error");
                    } else {
                        res.send("updated");
                    }
                });
            } else {
                const sql3 = `INSERT INTO supply(id, name, amount) VALUES (?, ?, ?)`;
                connection.query(sql3, [productId, productName, productAmount], (insertErr, result) => {
                    if (insertErr) {
                        console.error(insertErr.message);
                        res.send("error");
                    } else {
                        res.send("added");
                    }
                });
            }
        }
    });
});

// Cock
app.get("/cook", (req, res) => {
    if (req.session.isLoggedIn) {
        connection.query(`SELECT
            topping.ot_name, 
            sauce.sauce_name, 
            side_dishs.sid_name, 
            type_sushi.type, 
            order_sushi.*
        FROM
            order_sushi
            LEFT JOIN
            sauce
            ON 
                order_sushi.sauce_id = sauce.sauce_id
            LEFT JOIN
            side_dishs
            ON 
                order_sushi.sid_id = side_dishs.sid_id
            LEFT JOIN
            topping
            ON 
                order_sushi.ot_id = topping.ot_id
            LEFT JOIN
            type_sushi
            ON 
                order_sushi.type_id = type_sushi.type_id `,
            (error, results, fields) => {
                if (error) throw error;
                console.log(results)
                res.render("cook", { cookre: results })
                console.log(results)
            })
    } else {
        res.render("login", { error: "ไม่พบ session กรุณาล็อกอิน" });
    }
})
// Cook API
app.post("/cook", (req, res) => {
    const { table_number, type_sushi, topping, quantity, sauce, Side_dishs } = req.body

    if (!table_number || !type_sushi || !topping || !quantity || !sauce || !Side_dishs) {
        res.send("error")
    }
    req.session.order_sushi.push({ table_number, type_sushi, topping, quantity, sauce, Side_dishs })
    res.render("cook", { cookre: req.session.order_sushi })
})
// End Cook

// Bill
app.get("/bill", (req, res) => {
    if (req.session.isLoggedIn) {
        //   connection.query(`SELECT
        //   room.price, 
        //   room.amount, 
        //   room.ot_id, 
        //  room.sid_id, 
        //  room.sauce_id, 
        //  room.type_id, 
        //  room.table_number
        //   FROM
        //    room2
        //    LEFT JOIN
        //order_sushi
        //   ON 
        //        room.order_id = order_sushi.order_id
        //   LEFT JOIN
        //  sauce
        //   ON 
        //       order_sushi.sauce_id = sauce.sauce_id AND
        //       room.sauce_id = sauce.sauce_id
        //   LEFT JOIN
        //    topping
        //    ON 
        //        order_sushi.ot_id = topping.ot_id AND
        //        room.ot_id = topping.ot_id AND
        //       room.price = topping.price
        //  LEFT JOIN
        //  type_sushi
        //  ON 
        //      order_sushi.type_id = type_sushi.type_id AND
        //     room.type_id = type_sushi.type_id
        //  LEFT JOIN
        //  side_dishs
        //  ON 
        //      order_sushi.sid_id = side_dishs.sid_id AND
        //    room.sid_id = side_dishs.sid_id WHERE table_number= '${tableId}'`, (error, results, fields) => {
        //      if (error) throw error;
        //  res.render("bill", {cookre: results})
        //    console.log(results)
        //})
        res.render("bill", { bill: req.session.bill })
    } else {
        res.render("login", { error: "ไม่พบ session กรุณาล็อกอิน" });
    }
})

app.get("/bill/:tableId", (req, res) => {
    const tabId = req.params.tableId
    if (req.session.isLoggedIn) {
        connection.query(`SELECT
       room.table_number, 
       type_sushi.type, 
       sauce.sauce_name, 
       side_dishs.sid_name, 
       topping.ot_name, 
       room.amount, 
       room.price
   FROM
       room
       LEFT JOIN
       sauce
       ON 
           room.sauce_id = sauce.sauce_id
       LEFT JOIN
       side_dishs
       ON 
           room.sid_id = side_dishs.sid_id
       LEFT JOIN
       topping
       ON 
           room.ot_id = topping.ot_id AND
           room.price = topping.price
       LEFT JOIN
       type_sushi
       ON 
           room.type_id = type_sushi.type_id WHERE table_number=${tabId}`, (error, results, fields) => {
            if (error) throw error;
            res.render("bill", { bill: results }) //
            console.log(results)
        })

    } else {
        res.render("login", { error: "ไม่พบ session กรุณาล็อกอิน" });
    }
})

// Bill API
app.post("/bill", (req, res) => {
    const { id, name, price, amount } = req.body

    if (!id || !name || !price || !amount) {
        res.send("error")
    }
    req.session.cart.push({ id, name, price, amount })
    res.render("bill", { cart: req.session.cart })
})
// End Bill


// Init Web Server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});