git pull
Make
docker build .
tagName=$(docker images | awk '{print $3}' | awk 'NR==2')
docker tag $tagName toadlessss/dashboard-backend:latest
docker login
docker push toadlessss/dashboard-backend:latest
echo "Done!