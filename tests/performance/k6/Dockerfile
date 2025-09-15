FROM grafana/k6:latest
WORKDIR /tests
COPY . /tests
# Default API base inside Docker network
ENV K6_API=http://backend:3000/api
CMD ["run", "/tests/smoke.js"]