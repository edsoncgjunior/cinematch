FROM mcr.microsoft.com/playwright:v1.44.1-jammy
RUN apt-get update && apt-get install -y python3-pip && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir robotframework robotframework-browser robotframework-requests
RUN rfbrowser init
WORKDIR /tests
COPY . /tests
