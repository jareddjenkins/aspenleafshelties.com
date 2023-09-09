
## Build

colima start
docker-buildx build . --platform linux/amd64 -t jareddjenkins/aspenleaf:latest --push
