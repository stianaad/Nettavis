module.exports = class Dao{
    constructor(pool){
        this.pool = pool;
    }

    query(sql, params, callback) {
        this.pool.getConnection((err, connection) => {
            console.log("dao: connected to database");
            if (err) {
                console.log("dao: error connecting");
                callback(500, { error: "feil ved ved oppkobling" });
            } else {
                console.log("dao: running sql: " + sql);
                connection.query(sql, params, (err, rows) => {
                    connection.release();
                    if (err) {
                        console.log(err);
                        callback(500, { error: "error querying" });
                    } else if(rows.length===0){
                        console.log("nulll");
                        callback(404,{error: "page not found"});
                    } else {
                        console.log("dao: returning rows" + "\n"+rows);
                        callback(200, rows);
                    }
                });
            }
        });
    }
};