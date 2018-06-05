sudo docker kill task-manager
sudo docker rm task-manager
sudo docker images purge
sudo docker system prune -a -f
sudo docker rmi task-manager
sudo docker build -t task-manager .
sudo docker run -p 3000:3000 --name task-manager -d task-manager 