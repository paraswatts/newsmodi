
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var FCM = require('fcm-node');
var serverKey = 'AAAAH9DxXVY:APA91bFcNGQsMfeRwpPwgse0krtZO8RSc5WgKyXIKiBc4ZeulhIaCvbMx-SHoeLg6slHIsJ7MZd3n96plQwGpnzbCaQ6xQ_ojcm0Ft0HqGxrL4RhTBPDa1_nAvXbSzJIuOuBZ1gIGgRp'; //put your server key here
var fcm = new FCM(serverKey);
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var promise = require('bluebird');
const { Pool, Client } = require('pg')
const connectionString = "postgres://phblpwiezukxiw:8d336b31b3688b9c76e349e8d488ef349edb3eb2035004d158ebea869d3f34c8@ec2-23-21-136-232.compute-1.amazonaws.com:5432/d830i11vl0l42m"
console.log("conn", connectionString)
const pool = new Pool({
    user: 'brfexwcmlnvlkl',
    host: 'ec2-23-21-136-232.compute-1.amazonaws.com',
    database: 'd8nukkgmf37as6',
    password: '161337aa14a8e3aa96c9589bd16e10ac14942367ca25bc69b41d04246a56d822',
    port: 5432,
})
// const pool = new Pool({
//     connectionString: connectionString,
// })

pg.defaults.ssl = true;


var News = require('./News');


router.post('/', function (req, res) {
    console.log("log is", req.body.newsObj)

    const queryString = {
        text: 'INSERT INTO news_articles(source, author,description,url,urlToImage,publishedAt,title) VALUES($1, $2,$3,$4,$5,$6,$7)',
        values: [req.body.newsObj.source,
        req.body.newsObj.author,
        req.body.newsObj.description,
        req.body.newsObj.url,
        req.body.newsObj.urlToImage,
        req.body.newsObj.publishedAt,
        req.body.newsObj.title
        ],
    }
    pool.on('error', (err, client) => {
        console.log('error ', err); process.exit(-1);
    });
    pool.connect((errPool, client, done) => {

        client.query(queryString, (err, news) => {
            done()
            if (err) {
                console.log(err)
            } else {
                //client.release()
                var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                    to: '/topics/namo-test',
                    collapse_key: 'your_collapse_key',

                    notification: {
                        title: req.body.newsObj.title,
                        body: req.body.newsObj.description
                    }
                };

                // fcm.send(message, function (err, response) {
                //     if (err) {
                //         console.log("Something has gone wrong!");
                //     } else {
                //         console.log("Successfully sent with response: ", response);
                //     }
                // });
            }
            res.status(200).send(news);

        })
    })

    // News.create({
    //     source: req.body.newsObj.source,
    //     author: req.body.newsObj.author,
    //     title: req.body.newsObj.title,
    //     description: req.body.newsObj.description,
    //     url: req.body.newsObj.url,
    //     urlToImage: req.body.newsObj.urlToImage,
    //     publishedAt: req.body.newsObj.publishedAt
    // },
    //     function (err, news) {
    //         console.log(err)
    //         if (err) return res.status(500).send("There was a problem adding the information to the database.");
    //         if (res) {
    //             var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    //                 to: '/topics/namo-test',
    //                 collapse_key: 'your_collapse_key',

    //                 notification: {
    //                     title: req.body.newsObj.title,
    //                     body: req.body.newsObj.description
    //                 }
    //             };

    //             // fcm.send(message, function (err, response) {
    //             //     if (err) {
    //             //         console.log("Something has gone wrong!");
    //             //     } else {
    //             //         console.log("Successfully sent with response: ", response);
    //             //     }
    //             // });
    //         }
    //         res.status(200).send(news);
    //     });
});



// RETURNS ALL THE IN THE DATABASE
router.get('/', function (req, res) {
    var limit = 20;
    var skip = (parseInt(req.query.pageNo) - 1) * parseInt(limit);
    //let coll = db.collection('news');
    // News.count().then((count) => {
    //     if (count > 0) {
    //         News.find({}).limit(limit)
    //             .skip(skip).exec(function (err, news) {
    //                 if (err) return res.status(500).send("There was a problem finding the users.");

    //                 let obj = {
    //                     totalCount: count, articles: news
    //                 }

    //                 console.log("obj", obj)

    //                 res.status(200).send({ totalCount: count, articles: news });
    //             });
    //     }
    // });
    //let count = db.any('select count(*) from news')
    pool.on('error', (err, client) => {
        console.log('error ', err); process.exit(-1);
    });
    // pool.connect((errPool, client, done) => {

    //     console.log(client, errPool)

    //     client.query('select count(*) from news_articles', (err, response) => {
    //         client.release()
    //         console.log(err, "response", response)
    //     })
    // })
    pool.connect((errPool, client, done) => {
        console.log("client", client, errPool)
        client.query('select * from news_articles limit ' + limit + ' OFFSET ' + skip, (err, response) => {
            console.log(err, response)
            if (response) {
                let obj = {
                    status: 'success',
                    data: response.rows,
                    totalCount: response.rowCount,
                    message: 'Retrieved ALL news'
                }
                client.release()
                console.log("obj", obj)
                res.send(obj)
                // return {
                //     status: 'success',
                //     data: res.rows,
                //     totalCount: 20,
                //     message: 'Retrieved ALL news'
                // };
            }
            //pool.end()
        })
    })
});

// GETS A SINGLE USER FROM THE DATABASE

// DELETES A USER FROM THE DATABASE
router.delete('/:id', function (req, res) {
    News.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User: " + user.name + " was deleted.");
    });
});

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/:id', function (req, res) {
    News.findByIdAndUpdate(req.params.id, req.body.newsObj, { new: true }, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
});


module.exports = router;