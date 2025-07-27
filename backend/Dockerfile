FROM python:3.12-slim

# Set work directory
WORKDIR /app

# Copy requirements
COPY requirements.txt ./
COPY requirements2.txt ./

# Install dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt
RUN pip install -r requirements2.txt

# Copy the rest of the backend code
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Start FastAPI with uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]