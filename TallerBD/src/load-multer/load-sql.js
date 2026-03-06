import express from 'express';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { pool } from "../config/MySQL/db-mysql.js";
import { createMulter, uploadDir } from "./multer.js";

export const sqlUploadRouter = express.Router();

// create the multer
const upload = createMulter();

// read csv file
async function readCsvFile(filePath) {
    const results = [];

    // parse the csv file using csv-parser
    await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(
                csv({
                    mapHeaders: ({ header }) => header.trim(),
                    mapValues: ({ value }) => value.trim()
                })
            )
            .on('data', (data) => results.push(data))
            .on('end', resolve)
            .on('error', reject);
    });

    return results;
}

// validate csv file
function getValidRows(results) {
    if (results.length === 0) {
        return [];
    }

    const columns = Object.keys(results[0]);

    // filter out rows with empty or whitespace-only values
    const validRows = results.filter(row =>
        columns.some(col => row[col] && row[col].trim() !== '')
    );

    return validRows;
}

// insert csv file into table
async function insertCsvIntoTable(tableName, filePath) {
    const results = await readCsvFile(filePath);

    if (results.length === 0) {
        console.log(`El archivo ${path.basename(filePath)} está vacío o tiene formato incorrecto.`);
        return;
    }

    const columns = Object.keys(results[0]);
    const validRows = getValidRows(results);

    // filter out rows with empty or whitespace-only values
    if (validRows.length === 0) {
        console.log(`El archivo ${path.basename(filePath)} no tiene filas válidas.`);
        return;
    }

    // joined column names and values for the SQL query
    const columnNamesString = columns.map(c => `\`${c}\``).join(', ');
    const values = validRows.map(row => columns.map(col => row[col]));


    // insert the data into the table
    const sql = `
        INSERT IGNORE INTO \`${tableName}\` (${columnNamesString})
        VALUES ?
    `;

    // connection to the database
    const [dbResult] = await pool.query(sql, [values]);

    console.log(
        `Tabla '${tableName}': ${dbResult.affectedRows} registros insertados desde ${path.basename(filePath)}`
    );
}

// load csv files on startup
export async function loadCsvFilesOnStartup() {
    if (!fs.existsSync(uploadDir)) {
        console.log('La carpeta de uploads no existe.');
        return;
    }

    // tables to load in order
    const loadOrder = ['buyer.csv', 'seller.csv', 'vehicle.csv', 'order.csv', 'sale.csv'];

    for (const fileName of loadOrder) {
        const filePath = path.join(uploadDir, fileName);

        // check if the file exists
        if (!fs.existsSync(filePath)) {
            console.log(`Archivo no encontrado: ${fileName}`);
            continue;
        }

        // get the table name from the file name
        const tableName = path.parse(fileName).name;

        try {

            // insert the file into the table
            await insertCsvIntoTable(tableName, filePath);
        } catch (error) {
            console.error(`Error cargando ${fileName}:`, error.message);
        }
    }
}

// Ruta manual para seguir subiendo archivos por POST
sqlUploadRouter.post('/sql/:tableName', upload.single('archivo'), async (req, res) => {
    const { tableName } = req.params;

    // check if a file was uploaded
    if (!req.file) {
        return res.status(400).json({ mensaje: 'No se subió ningún archivo.' });
    }

    try {
        // insert the file into the table
        await insertCsvIntoTable(tableName, req.file.path);

        res.json({
            mensaje: `Datos para la tabla '${tableName}' insertados correctamente.`
        });

        // delete the uploaded file
        fs.unlinkSync(req.file.path);
    } catch (error) {
        console.error("Error procesando el archivo:", error);
        res.status(500).json({
            mensaje: 'Ocurrió un error al procesar el archivo.',
            error: error.message
        });
    }
});
