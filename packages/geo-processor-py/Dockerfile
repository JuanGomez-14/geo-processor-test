# Use a Python 3.10 slim image as the base.
# Slim images are smaller and more efficient for production environments.
FROM python:3.10-slim

# Set the working directory inside the container.
WORKDIR /app

# Copy the requirements file and install the dependencies first.
# This improves build efficiency by leveraging Docker's layer caching.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire application code into the container.
COPY . .

# Expose the port on which the FastAPI application will run.
# This doesn't publish the port but documents it.
EXPOSE 8000

# Define the command to run the application using Uvicorn.
# The `0.0.0.0` host makes the server accessible from outside the container.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]