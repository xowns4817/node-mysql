let express = require('express');
let router = express.Router();
let pool = require("./db");
let mysql = require('mysql');

//영화 목록 조회
router.get("/", function(req, res) {

  pool.getConnection(function(err, conn){

    if(err) throw err;
    conn.query('SELECT * from movies', function (error, results, fields) {
        if (error) throw error;

        let response = new Object;
        let data_arr = new Array();
        let len = results.length;
        response.count = len;

        for(var i=0; i<len; i++) {
          var movie_id = results[i].movie_id;
          var title = results[i].title;
          data_arr.push({'movie_id': movie_id, 'title': title});
        }
        response.data = data_arr;
       res.send(response);
       conn.release();
      });
  });
});

//영화 정보 보기
router.get("/:id", function(req, res) {

    pool.getConnection(function(err, conn) {
    if(err) throw err;
    //영화 조회
    conn.query('SELECT * FROM MOVIES WHERE movie_id = ?', [req.params.id], function(error, results, fields) {
        let movie = results[0];
        let movie_id = results[0].movie_id;
        console.log("movie : ", movie);

        //댓글 조회
        conn.query("SELECT * FROM reviews WHERE movie_id = ?", [movie_id], function(error, results, fields){

            let review_list = results;
            let reviews = new Array();
            for(var i=0; i<review_list.length; i++) {
                reviews[i] = review_list[i].review;
            }

            movie.reviews = reviews;
            res.send(movie);
            conn.release();
        })
    })
});
});

//영화 정보 추가
router.post("/", function(req, res) {

    let title = req.body.title;
    let director = req.body.director;
    let year = req.body.year;
    
    pool.getConnection(function(err, conn) {
        if(err) throw(err);
        conn.query("INSERT INTO MOVIES (title, director, year) VALUES (?, ?, ?)", [title, director, year], function(err, results, fields){
            if (err) throw error;
            res.send("db insert ok!!");
            conn.release();
        });
    });
});

//영화 정보 수정
router.put("/", function(req, res) {

    let movie_id = req.body.movie_id;
    let title = req.body.title;
    let director = req.body.director;
    let year = req.body.year;

    pool.getConnection(function(err, conn) {

        if(err) throw(err);
        conn.query("UPDATE MOVIES SET title = ?, director = ?, year = ? where movie_id = ?", [title, director, year, movie_id], function(err, results, fields){
            if (err) throw error;
            res.send("db update ok!!");
            conn.release();
        });
    });
});

//영화 정보 삭제
router.delete("/:id", function(req, res) {
   
    pool.getConnection(function(err, conn) {
        if(err) throw(err);
        conn.query("DELETE FROM movies where movie_id = ?", [req.params.id], function(err, results, fields){
            if (err) throw error;
            res.send("db delete ok!!");
            conn.release();
        });
    });
 
});

//영화 리뷰 추가
router.post("/:id/review", function(req, res) {
    
    let review = req.body.review;

    pool.getConnection(function(err, conn) {
        conn.query("INSERT INTO REVIEWS (movie_id, review) VALUES (?, ?)", [req.params.id, review], function(err, results, fields){
            if (err) throw error;
            res.send("db insert ok!!");
            conn.release();
        });
    });
})


module.exports = router;