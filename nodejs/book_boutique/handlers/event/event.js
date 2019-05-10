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
/event - Find all events.
This method support pagination.
Query paramers : 
    - page : the page number. By default its value is 1.
    - pageSize : the number of element in each page. By default its value is 10.
    - isbn : the isbn of the book.
Example of request:
    ".../event"
    ".../event?page=2"
    ".../event?pageSize=5"
    ".../event?page=1&pageSize=3"
    ".../event?page=3&pageSize=10&isbn=9788447394567"
*/
exports.findAll = async (event) => {
    let page = 1, pageSize = 10, isbn;
    if ((parameter = param.getQueryParameter(event, "page")) != null) {
        page = parameter;
    }
    if ((parameter = param.getQueryParameter(event, "pageSize")) != null) {
        pageSize = parameter;
    }
    let params = {
        TableName: 'bb_event',
        Limit: pageSize,
    };
    if ((parameter = param.getQueryParameter(event, "isbn")) != null) {
        let isbn = parameter;
        params.FilterExpression = "#bookId = :bookId";
        params.ExpressionAttributeNames = {
            "#bookId": "bookId"
        };
        params.ExpressionAttributeValues = {
            ":bookId": isbn
        }
    }
    return resp.stringify(200, await db.scan(params, page));
};

/*
/event/{id} - Find events by id.
Example of request: ".../event/CookBooks"
*/
exports.findById = async (event) => {
    if ((parameter = param.getPathParameter(event, "id")) != null) {
        let id = parameter;
        let params = {
            TableName: 'bb_event',
            Limit: 1,
            KeyConditionExpression: "#id = :id",
            ExpressionAttributeNames: {
                "#id": "id"
            },
            ExpressionAttributeValues: {
                ":id": id
            }
        };
        return resp.stringify(200, await db.query(params, 1));
    } else {
        return resp.stringify(null);
    }
};