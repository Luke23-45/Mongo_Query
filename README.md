
# Mongoose Query Practice Project

## Description

This project is a simple Node.js application built with TypeScript, designed specifically to demonstrate and practice various query operations using the Mongoose ODM (Object Data Modeling) library for MongoDB.

## Purpose

The main goal is to provide a hands-on environment for learning and experimenting with common and advanced Mongoose query types, from basic document retrieval to complex aggregation pipelines.

## Features / Queries Covered

This project includes examples for:

* **Basic Find Operations:** `find()`, `findOne()`, `findById()`
* **Comparison Operators:** `$gt`, `$gte`, `$lt`, `$lte`, `$eq`, `$ne`, `$in`, `$nin`
* **Logical Operators:** `$and`, `$or`, `$not`, `$nor`
* **Element Operators:** `$exists`, `$type`
* **Evaluation Operators:** `$regex`, `$text` (requires text index)
* **Array Operators:** `$all`, `$in`, `$size` (and explanation for `$elemMatch`)
* **Projection:** Selecting specific fields
* **Sorting:** `sort()`
* **Pagination:** `skip()`, `limit()`
* **Counting:** `countDocuments()`, `estimatedDocumentCount()`
* **Querying Embedded Documents:** Using dot notation
* **Update Operations:** `updateOne()`, `updateMany()`, `findOneAndUpdate()`
* **Delete Operations:** `deleteOne()`, `deleteMany()` (commented out by default)
* **Aggregation Framework:** Basic examples using `$match`, `$group`, `$sort`, `$project`, `$avg`, `$sum`

## Tech Stack

* Node.js
* TypeScript
* Mongoose
* MongoDB
* dotenv (for environment variables)
* ts-node (for running TypeScript directly)

## Prerequisites

* Node.js (v16 or later recommended)
* npm or yarn
* MongoDB server running locally or accessible via URI

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd mongoose-query-practice
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Create Environment File:**
    Create a `.env` file in the root directory of the project.

4.  **Configure MongoDB URI:**
    Add your MongoDB connection string to the `.env` file:
    ```dotenv
    # .env
    MONGODB_URI=mongodb://localhost:27017/mongoose_query_practice
    ```
    *(Replace with your actual connection string if different)*






