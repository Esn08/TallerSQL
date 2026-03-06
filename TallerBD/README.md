## Overview

This project is a backend service designed to manage information related to a vehicle sales workflow. It uses **MySQL** as the relational database and **Express** as the HTTP server framework.

The application can:

- initialize the database schema automatically,
- import seed data from CSV files,
- expose CRUD endpoints for the `vehicle` table,
- receive CSV uploads for manual data imports.

It is a good foundation for academic projects, internal tools, or small inventory systems.

---

## Features

- REST API built with Express
- MySQL connection pooling using `mysql2`
- Automatic schema creation on startup
- Generic repository layer for reusable CRUD operations
- Vehicle CRUD endpoints
- CSV parsing and import support
- File upload handling with Multer
- Development server with Nodemon
- ES Modules support

---

## Tech Stack

- **Node.js**
- **Express**
- **MySQL**
- **mysql2**
- **Multer**
- **csv-parser**
- **Nodemon**

---

## Project Structure

# Database Schema

The application initializes the following tables if they do not already exist:

- `buyer`
- `seller`
- `vehicle`
- `order`
- `sale`

### `vehicle` table

The `vehicle` table includes the following main fields:

- `vehicle_id`
- `plate_vehicle`
- `model`
- `color`
- `vehicle_state`
- `operating_state`
- `mileage`

This table is the main focus of the current CRUD API.

---

## API Endpoints

## Vehicle Endpoints

Depending on how the router is mounted in your server file, the final URL prefix may vary.

### 1. Get all vehicles

**GET** `/vehicle`

Returns all records from the `vehicle` table.

---

### 2. Get one vehicle by ID

**GET** `/vehicle/:id`

Returns a single vehicle record by `vehicle_id`.

---

### 3. Create a vehicle

**POST** `/vehicle`

Creates a new vehicle record.

**Required fields:**

- `plate_vehicle`
- `model`
- `color`
- `operating_state`

**Optional fields:**

- `vehicle_state`
- `mileage`

---

### 4. Update a vehicle

**PUT** `/vehicle/:id`

Updates an existing vehicle by `vehicle_id`.

---

### 5. Delete a vehicle

**DELETE** `/vehicle/:id`

Deletes a vehicle by `vehicle_id`.

---



