//Importing some libraries.
//DB is for db connection.
//param is for parameters extraction.
//resp if for response management.
const db = require('db');
const param = require('paramUtil');
const resp = require('responseUtil');

//Global variables.
let parameter;

/*
/genre - Find all genres.
This method support pagination.
Query paramers : 
    - page : the page number. By default its value is 1.
    - pageSize : the number of element in each page. By default its value is 10.
Example of request: ".../genre?page=3&pageSize=10"
*/
exports.findAll = async (event) => {
    let page = 1, pageSize = 1000;
    if ((parameter = param.getQueryParameter(event, "page")) != null) {
        page = parameter;
    }
    if ((parameter = param.getQueryParameter(event, "pageSize")) != null) {
        pageSize = parameter;
    }
    let params = {
        TableName: 'bb_genre',
        Limit: pageSize,
    };
    let dbResult = await db.scan(params);
    return resp.stringify(200, dbResult.Items.slice((page - 1) * pageSize, page * pageSize));
};

/*
/count/genre - Find all genres.
Example of request: ".../count/genre?page=3&pageSize=10"
*/
exports.countFindAll = async (event) => {
    let params = {
        TableName: 'bb_genre',
        Limit: pageSize,
    };
    let dbResult = await db.scan(params);
    let response = {
        "Elements": dbResult.Count
    }
    return resp.stringify(200, response);
};