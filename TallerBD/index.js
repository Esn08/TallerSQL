import express from 'express';
const app = express();
import { createSchemas } from './src/config/MySQL/db-mysql.js';

// import routes
import { vehicleRouter } from "./src/routes/vehicle-route.js";
import { sqlUploadRouter } from "./src/load-multer/load-sql.js";
import { loadCsvFilesOnStartup } from "./src/load-multer/load-sql.js";

app.use(express.json());
app.use(express.static('public'));

// routes
app.use('/vehicles', vehicleRouter);
app.use("/upload", sqlUploadRouter);


// Start the server when starting the application
async function startServer() {
    try {

        // Create the database schema
        await createSchemas();
        console.log('Connected to MySQL...\nDatabase created successfully...');

        // Load CSV files on startup
        await loadCsvFilesOnStartup();
        console.log('Archivos CSV cargados al iniciar la aplicación.');

        app.use('/', (req, res) => {
            res.send('Hello World');
        });

        // Start the server
        app.listen(3000, () =>
            console.log('Server is running on http://localhost:3000')
        );

    } catch (error) {

        // Handle any errors that occur during startup
        console.log(error);
    }
}

startServer();