/**
 * @file db-mysql.js
 * @summary MySQL Database Configuration and Schema Initialization
 * @description This module configures and exports a MySQL connection pool for efficient database querying.
 * It also provides a function to programmatically create the database and all necessary tables if they
 * do not already exist, ensuring the application can start up correctly.
 */

import mysql from 'mysql2/promise'

/**
 * A connection pool to the MySQL database.
 * Using a connection pool is more efficient than creating a new connection for every query,
 * as it manages a set of pre-created connections that can be reused.
 **/

export let pool = await mysql.createPool(
            {
                host: "localhost",
                port: 3306,
                user: "admin",
                database: "taller_Venta_Vehiculos_db",
                password: "123",
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            })

/**
 * Initializes the database and its tables.
 * This function connects to the MySQL server, creates the main database if it doesn't exist,
 * and then creates all required application tables if they don't exist. This ensures that the
 * application's database schema is correctly set up on the first run.
 * It uses a temporary, single connection for setup and ensures it is closed afterward.
 */

export async function createSchemas() {
    let connection;

    try {
        // Create a temporary connection without specifying a database to create it first.
        connection = await mysql.createConnection(
            {
                host: "localhost",
                port: 3306,
                user: "admin",
                password: "123",
            }
        );

        // Create the main database if it's not already present.
        await connection.query(`CREATE DATABASE IF NOT EXISTS taller_Venta_Vehiculos_db;`);

        // Switch the connection context to use the newly created database.
        await connection.query(`USE taller_Venta_Vehiculos_db;`);

        // --- Table Creation ---
        // Each `CREATE TABLE IF NOT EXISTS` query ensures that existing tables are not dropped.
        await connection.query(`CREATE TABLE IF NOT EXISTS buyer (
                                    buyer_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                                    buyer_name VARCHAR(45) NOT NULL,
                                    buyer_telephone VARCHAR(45) NOT NULL,
                                    PRIMARY KEY (buyer_id),
                                    UNIQUE INDEX buyer_name (buyer_name ASC))
                                    ENGINE = InnoDB;
        `)

        // Create the `seller` table if it doesn't exist.'
        await connection.query(`CREATE TABLE IF NOT EXISTS seller (
                                    seller_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                                    seller_name VARCHAR(45) NOT NULL,
                                    seller_telephone VARCHAR(45) NOT NULL,
                                    PRIMARY KEY (seller_id),
                                    UNIQUE INDEX seller_name (seller_name ASC))
                                    ENGINE = InnoDB;
        `)

        // Create the `vehicle` table if it doesn't exist.'
        await connection.query(`CREATE TABLE IF NOT EXISTS vehicle (
                                    vehicle_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                                    plate_vehicle VARCHAR(10) NOT NULL,
                                    model VARCHAR(45) NOT NULL,
                                    color VARCHAR(45) NOT NULL,
                                    vehicle_state VARCHAR(30) NOT NULL DEFAULT 'Nuevo',
                                    operating_state VARCHAR(30) NOT NULL,
                                    mileage BIGINT NOT NULL DEFAULT 0,
                                    PRIMARY KEY (vehicle_id),
                                    UNIQUE INDEX plate_vehicle (plate_vehicle ASC))
                                    ENGINE = InnoDB;
        `)

        // Create the `order` table if it doesn't exist.'
        await connection.query(`CREATE TABLE IF NOT EXISTS \`order\` (
                                    order_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                                    order_date DATE NULL DEFAULT NULL,
                                    order_price DECIMAL ( 10, 0 ) NULL DEFAULT NULL,
                                    seller_id INT UNSIGNED NOT NULL,
                                    vehicle_id INT UNSIGNED NOT NULL, 
                                    PRIMARY KEY (order_id ),
                                    UNIQUE INDEX vehicle_id ( vehicle_id ASC ),
                                    INDEX order_id_idx ( order_id ASC ),
                                    CONSTRAINT PK_order_id FOREIGN KEY ( order_id )
                                    REFERENCES seller ( seller_id),
                                    CONSTRAINT PK_vehicle_id_order 
                                    FOREIGN KEY ( vehicle_id)
                                    REFERENCES vehicle (vehicle_id))
                                    ENGINE = InnoDB;

        `)

        // Create the `sale` table if it doesn't exist.'
        await connection.query(`CREATE TABLE IF NOT EXISTS \`sale\` (
                                    sale_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                                    sale_date DATE NULL,
                                    sale_price DECIMAL NULL,
                                    buyer_id INT UNSIGNED NOT NULL,
                                    vehicle_id INT UNSIGNED NOT NULL UNIQUE,
            
                                    PRIMARY KEY ( sale_id ),
                                    INDEX buyer_id_idx ( buyer_id ASC),
                                    INDEX vehicle_id_idx ( vehicle_id ASC ),
                                    CONSTRAINT PK_buyer_id FOREIGN KEY ( buyer_id)
                                    REFERENCES buyer ( buyer_id )
                                    ON DELETE NO ACTION
                                    ON UPDATE NO ACTION,
                                    CONSTRAINT PK_vehicle_id
                                    FOREIGN KEY ( vehicle_id )
                                    REFERENCES vehicle ( vehicle_id )
                                    ON DELETE NO ACTION
                                    ON UPDATE NO ACTION)
                                    ENGINE = InnoDB;
        `)


    } catch (error) {

        // Catches any errors during connection or query execution.
        console.log('\n¡The database could not be created!')
        console.log(error.message)

    } finally {

        // The `finally` block ensures that the temporary connection is always closed
        if (connection) {
            connection.end()
        }

    }
}

