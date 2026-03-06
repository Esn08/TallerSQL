/**
 * @file client-routes.js
 * @summary Defines the API routes for vehicle-related CRUD operations.
 * @description This module creates an Express router that handles all the endpoints
 * for creating, reading, updating, and deleting client records. It uses a generic
 * repository for database interactions.
 */

import express from "express";
import { pool } from "../config/MySQL/db-mysql.js";
import {selectAll, selectBy, insertIntoTable, deleteFromTable, updateTable} from "../repositories/repository.js";

/**
 * Express router for /vehicle routes.
 * @type {Router}
 */

export let vehicleRouter = express.Router();

/**
 * @route GET /
 * @summary Get a list of all vehicle.
 * @description Retrieves all records from the `vehicle` table.
 * @returns {Array<object>} 200 - An array of vehicle objects.
 */

vehicleRouter.get('/', async (req, res) => {

    try {

        let response = await selectAll(pool, 'vehicle')

        if (response.length === 0) {
            res.status(200).json({ response: 200, message: "No hay registros"})
        }

        res.status(200).json( { status: "200", message: "Registro encontrado exitosamente", response: response})

    } catch (error) {
        res.status(500).send(error.message)
    }


});

/**
 * @route GET /:id
 * @summary Get a single vehicle by vehicle_id.
 * @description Retrieves a specific vehicle from the `vehicle` table using their unique vehicle_id as an identifier.
 * @param {string} req.params.id - The id of the vehicle to retrieve.
 * @returns {Array<object>} 200 - An array containing the single matching vehicle object.
 * @returns {string} 200 - A "not found" message if no vehicle matches the vehicle_id.
 */

vehicleRouter.get('/:id', async (req, res) => {

    try {
        let id = req.params.id;

        let response = await selectBy(pool, 'vehicle', 'vehicle_id', id)
        res.status(200).json( { status: "200", message: "Registro encontrado exitosamente", response: response})

    } catch (error) {
        res.status(500).send(error.message)
    }

})
/**
 * @route POST /
 * @summary Create a new vehicle.
 * @description Adds a new vehicle to the `vehicle` table. Requires name, last name, email, and city in the request body.
 * @param {object} req.body - The vehicle object to create.
 * @returns {object} 201 - The result packet from the database insertion.
 * @returns {string} 400 - An error message if any required fields are missing.
 */

vehicleRouter.post('/', async (req, res) => {

    try {

        if (req.body.plate_vehicle && req.body.model && req.body.color && req.body.operating_state) {

            let response = await insertIntoTable(pool, 'vehicle', req.body)
            res.status(200).json( { status: "200", response: response})

        } else {
            res.status(400).send('Faltan datos, debe haber nombre e email del proveedor')
        }

    }catch (error) {
        res.status(500).send(error.message)
    }


})

/**
 * @route PUT /:id
 * @summary Update an existing vehicle.
 * @description Updates a vehicle's information, identified by their vehicle_id. It first checks if the vehicle exists.
 * @param {string} req.params.id - The vehicle_id of the vehicle to update.
 * @param {object} req.body - An object containing the vehicle fields to be updated.
 * @returns {object} 200 - The result packet from the database update.
 * @returns {string} 404 - A "not found" message if the vehicle to update does not exist.
 */

vehicleRouter.put('/:id', async(req, res) => {

    try {
        let id = req.params.id;

        // First, check if the record exists
        let response = await selectBy(pool, 'vehicle', "vehicle_id", id)

        if (response.length > 0 && response instanceof Array) {

            // If it exists, proceed with the update
            let data = req.body;

            let logId = await selectBy(pool, 'vehicle', 'vehicle_id', id)

            let updateResponse = await updateTable(pool, 'vehicle', data, 'vehicle_id', id)

            res.status(200).json( { status: "200", response: updateResponse})

        } else {

            // If it does not exist, send a 404 error
            res.status(404).send("¡No se encontró el registro a actualizar!")
        }

    } catch (error) {
        res.status(500).send(error.message)
    }

})

/**
 * @route DELETE /:id
 * @summary Delete a vehicle.
 * @description Deletes a vehicle from the database, identified by their vehicle_id. It first checks if the vehicle exists.
 * @param {string} req.params.id - The vehicle_id of the vehicle to delete.
 * @returns {object} 200 - The result packet from the database deletion.
 * @returns {string} 404 - A "not found" message if the vehicle to delete does not exist.
 */

vehicleRouter.delete('/:id', async (req, res) => {
    try {

        let id = req.params.id;

        // First, check if the record exists
        let response = await selectBy(pool, 'vehicle', "vehicle_id", id)

        if (response.length > 0 && response instanceof Array) {

            let logId = await selectBy(pool, 'vehicle', 'vehicle_id', id)

            // If it exists, proceed with the deletion
            let deleteResponse = await deleteFromTable(pool, 'vehicle', 'vehicle_id', id)

            res.status(200).json( { status: "200", message: "Registro eliminado exitosamente"})


        } else {
            // If it does not exist, send a 404 error
            res.status(404).send("¡No se encontró el registro a eliminar!")
        }

    } catch (error) {
        res.status(500).send(error.message)
    }


})