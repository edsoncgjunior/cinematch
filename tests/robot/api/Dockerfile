FROM python:3.12-slim
WORKDIR /tests
RUN pip install --no-cache-dir robotframework robotframework-requests
COPY . /tests
CMD ["robot", "-d", "/out", "/tests/api.robot"]
