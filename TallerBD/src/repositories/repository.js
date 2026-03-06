/**
 * @file repository.js
 * @summary A generic repository for common MySQL database operations.
 * @description This module provides a set of reusable, asynchronous functions to perform
 * standard CRUD (Create, Read, Update, Delete) operations on any given table.
 * Each function takes a connection pool and table name, making them highly dynamic and reusable
 * across different parts of the application.
 * Note: Error handling in this module currently returns a string message. In a production
 * environment, it would be better to throw an error to be caught by a higher-level handler.
 */


/**
 * Selects all records from a specified table.
 * @param {import('mysql2/promise').Pool} pool - The active MySQL connection pool.
 * @param {string} table - The name of the table to query.
 * @returns {Promise<Array<object>|string>} A promise that resolves to an array of record objects on success,
 * or an error message string on failure.
 */

export let selectAll = async function (pool, table) {
    let response, ignore;

    try {

        // The mysql2/promise query returns an array: [rows, fields]. We only need the rows.
        [response, ignore] = await pool.query(`SELECT * FROM ${table};`)

    } catch (error) {

        response = "¡No se realizó la consulta!" + error.message

    }

    return response;
}
/**
 * Selects records from a table based on a specific attribute and filter value.
 * @param {import('mysql2/promise').Pool} pool - The active MySQL connection pool.
 * @param {string} table - The name of the table to query.
 * @param {string} attribute - The column/attribute to filter by (e.g., 'client_id').
 * @param {*} filter - The value to match against the attribute.
 * @returns {Promise<Array<object>|string>} A promise that resolves to an array of matching records,
 * a "not found" message if no records match, or an error message string on failure.
 */

export let selectBy = async function (pool, table, attribute, filter= null) {

    let response, ignore;

    try {

        if (filter) {
            [response, ignore] = await pool.query(`SELECT * FROM ${table} WHERE ${attribute} = ?`, [filter])

            if (response.length === 0) {

                response = "¡No se encontró el registro que busca!"
            }

        }

    } catch (error) {
        response = "¡No se realizó la consulta!" + error.message
    }

    return response;
}

/**
 * Inserts a new record into a specified table.
 * @param {import('mysql2/promise').Pool} pool - The active MySQL connection pool.
 * @param {string} table - The name of the table to insert into.
 * @param {object} data - An object where keys correspond to column names and values to the data to be inserted.
 * @returns {Promise<import('mysql2/promise').OkPacket|string>} A promise that resolves to the MySQL result packet on success,
 * or an error message string on failure.
 */

export let insertIntoTable = async function (pool, table, data) {

    let response;

    try {

        response = await pool.query(`INSERT INTO ${table} SET ?`, [data])

    } catch (error) {

        response = "No se pudo insertar el registro" + error.message

    } return response;

}

/**
 * Updates an existing record in a table based on a specific attribute and filter.
 * @param {Pool} pool - The active MySQL connection pool.
 * @param {string} table - The name of the table to update.
 * @param {object} data - An object containing the new data for the record (keys are column names).
 * @param {string} attribute - The column/attribute to use in the WHERE clause for filtering.
 * @param {*} filter - The value to identify the record to be updated.
 * @returns {Promise<import('mysql2/promise').OkPacket|string>} A promise that resolves to the MySQL result packet on success,
 * or an error message string on failure.
 */

export let updateTable = async function (pool, table, data, attribute, filter) {

    let response;

    try {
        response = await pool.query(`UPDATE ${table} SET ? WHERE ${attribute} = ?`, [data, filter])
        return response;

    } catch (error) {

        response = "No se pudo actualizar" + error.message
    }

    return response;

}

/**
 * Deletes a record from a table based on a specific attribute and filter.
 * @param {import('mysql2/promise').Pool} pool - The active MySQL connection pool.
 * @param {string} table - The name of the table to delete from.
 * @param {string} attribute - The column/attribute to use in the WHERE clause.
 * @param {*} filter - The value to identify the record to be deleted.
 * @returns {Promise<import('mysql2/promise').OkPacket|string>} A promise that resolves to the MySQL result packet on success,
 * or an error message string on failure.
 */

export let deleteFromTable = async function (pool, table, attribute, filter) {

    let response;

    try {
        response = await pool.query(`DELETE FROM ${table} WHERE ${attribute} = ?`, [filter])

    } catch (error){

        response = "No se pudo eliminar" + error.message
    }

    return response;

}

