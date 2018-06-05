sudo docker kill task-manager
sudo docker rm task-manager
sudo docker images purge
sudo docker system prune -a
sudo docker rmi task-manager
sudo docker build -t task-manager .
sudo docker run task-manager -d --name task-manager -p 80:80