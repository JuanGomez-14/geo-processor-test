# **Geo-Processor Microservice Ecosystem**

This project is a minimal, distributed system designed to process geographical coordinates. It consists of three independent microservices that work together to calculate the centroid and the bounding box for a set of latitude and longitude points.

## **1. Architecture Overview**

This application follows a **microservices architecture** using a **monorepo approach**. Each service (frontend, API, and geoprocessor) is self-contained within its own directory but managed under a single repository. This design was chosen for several key reasons:

  * **Separation of Concerns:** Each service has a single responsibility. The Python service handles the core geoprocessing logic, the NestJS API manages requests and acts as a gateway, and the Next.js app provides the user interface.
  * **Scalability:** Each service can be scaled independently based on its specific needs. For example, if the geoprocessing logic is compute-intensive, you can scale the Python service without affecting the others.
  * **Technology Flexibility:** It allows us to use the best tools for each job. Python is excellent for scientific computing (geoprocessing), NestJS is a robust choice for building scalable APIs, and Next.js is ideal for modern, fast web applications.

## **2. System Components**

### **Frontend (Next.js)**

  * **Purpose:** The user-facing component of the application.
  * **Key Features:**
      * **Interactive Map:** Displays an interactive map using the **Leaflet.js** library via the `react-leaflet` wrapper.
      * **Data Input:** Allows users to add geographical points in two ways:
        1.  **Clicking on the map:** A user can simply click to add a point marker.
        2.  **Manual Input:** Users can enter specific latitude and longitude values in dedicated input fields.
      * **Data Visualization:** Upon processing, the frontend visualizes the calculated centroid (as a marker) and the bounding box (as a polyline) directly on the map.
      * **Usability:** Includes a "Help" modal to explain the features and allows users to remove points by clicking on a marker.

### **API Gateway (NestJS)**

  * **Purpose:** To act as the central entry point for all frontend requests, simplifying the system's architecture and improving security.
  * **Key Features:**
      * **Request Forwarding:** Forwards the geoprocessing requests from the frontend to the Python service.
      * **Input Validation:** Validates the incoming JSON data using a **Data Transfer Object (DTO)**, ensuring that only correctly formatted requests are sent to the backend.

### **Geoprocessor Service (FastAPI in Python)**

  * **Purpose:** The core business logic component responsible for all mathematical calculations.
  * **Key Features:**
      * **Core Logic:** Calculates the **centroid** (average latitude and longitude) and the **bounding box** (the maximum and minimum latitude and longitude).
      * **Robust Error Handling:** Validates that the input data is correct (e.g., at least three points, and all coordinates are numeric) to prevent runtime errors.
      * **Stateless:** The service does not store any data between requests, ensuring it is highly scalable.

## **3. Getting Started: Step-by-Step Guide**

To run the complete system, you must start each service individually.

### **Prerequisites**

  * **Node.js & pnpm:** Make sure you have Node.js installed, and use `pnpm` as your package manager.
  * **Python 3.10+:** Ensure Python is installed on your system.
  * **Docker:** You can optionally use Docker to run the Python service in an isolated container.

### **Step 1: Start the Python Geoprocessor Service**

You have two options to run the Python service:

**Option A: Using a Virtual Environment (Recommended for development)**

1.  Navigate to the Python service directory:
    ```bash
    cd packages/geo-processor-py
    ```
2.  Create and activate a Python virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```
3.  Install the required Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Start the FastAPI service:
    ```bash
    uvicorn main:app --reload
    ```
    This will start the FastAPI service on `http://127.0.0.1:8000`.

**Option B: Using Docker (Recommended for production)**

1.  Navigate to the Python service directory:
    ```bash
    cd packages/geo-processor-py
    ```
2.  Build the Docker image:
    ```bash
    docker build -t geo-processor-py .
    ```
3.  Run the container, mapping the internal port 8000 to your host machine's port 8000:
    ```bash
    docker run -p 8000:8000 geo-processor-py
    ```
    This will start the FastAPI service inside a container at `http://localhost:8000`.

### **Step 2: Start the NestJS API Gateway**

1.  Navigate to the NestJS API directory:
    ```bash
    cd packages/geo-processor-nestjs
    ```
2.  Install dependencies and start the service:
    ```bash
    pnpm install
    pnpm start:dev
    ```
    The NestJS API will now be running on port `3000`.

### **Step 3: Start the Next.js Frontend**

1.  Navigate to the Next.js frontend directory:
    ```bash
    cd packages/geo-processor-nextjs
    ```
2.  Install dependencies and start the application:
    ```bash
    pnpm install
    pnpm dev
    ```
    The frontend will now be accessible in your browser at `http://localhost:3001`.

## **4. User Guide: How to Use the App**

The application is straightforward to use:

1.  **Add Points:** Use either of the following methods to add points to the map:
      * **Click on the map:** Simply click on any location to add a marker.
      * **Manual Entry:** Enter the latitude and longitude in the input fields and click **"Add Point"**.
2.  **Process Points:** Once you have at least three points, click the **"Process Points"** button.
3.  **View Results:** The map will automatically update to show:
      * A **marker** for the calculated centroid.
      * A **bounding box** (a blue rectangle) that encloses all of your points.
      * A detailed list of the calculated coordinates for the centroid and bounding box below the map.
4.  **Remove Points:** To remove a point from the map, simply click on its marker.

## **5. Testing the API**

For developers who want to test the core geoprocessing API without a dedicated frontend, you can use a command-line tool like **cURL** or a dedicated API client like **Postman** or **Insomnia**. This method is effective for verifying the API's behavior and error handling.

### **Testing the Geoprocessor Service (FastAPI)**

To perform tests, ensure the Python service is running (see Step 1 of the Getting Started Guide). You can then send `POST` requests to its `/process` endpoint on `http://localhost:8000/process`.

Here are some examples of what you can test:

#### **Valid Request**

This request will correctly calculate and return the centroid and bounding box.

```bash
curl -X POST "http://localhost:8000/process" \
-H "Content-Type: application/json" \
-d '{
  "points": [
    { "lat": 40.7128, "lng": -74.0060 },
    { "lat": 34.0522, "lng": -118.2437 },
    { "lat": 33.7490, "lng": -84.3880 }
  ]
}'
```

**Expected Response:** A JSON object with the calculated `centroid` and `bounds`.

#### **Request with Missing Data**

This request is missing the required `points` field. The API should return a validation error.

```bash
curl -X POST "http://localhost:8000/process" \
-H "Content-Type: application/json" \
-d '{}'
```

**Expected Response:** A JSON object with a `422 Unprocessable Entity` status and a clear error message indicating the missing field.

#### **Request with Invalid Data**

This request includes a non-numeric value for `lat`. The API should return a validation error.

```bash
curl -X POST "http://localhost:8000/process" \
-H "Content-Type: application/json" \
-d '{
  "points": [
    { "lat": "invalid", "lng": -74.0060 },
    { "lat": 34.0522, "lng": -118.2437 }
  ]
}'
```

**Expected Response:** A JSON object with a `422 Unprocessable Entity` status and an error message about the invalid data type.

#### **Request with Insufficient Points**

This request has fewer than the required three points for calculation. The API should return a custom error message.

```bash
curl -X POST "http://localhost:8000/process" \
-H "Content-Type: application/json" \
-d '{
  "points": [
    { "lat": 40.7128, "lng": -74.0060 },
    { "lat": 34.0522, "lng": -118.2437 }
  ]
}'
```

**Expected Response:** A JSON object with a custom error message indicating that at least three points are required.