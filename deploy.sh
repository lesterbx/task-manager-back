sudo docker kill task-manager
sudo docker rm task-manager
sudo docker images purge
sudo docker system prune -a -f
sudo docker rmi task-manager
sudo docker build -t task-manager .
sudo docker run task-manager -d -p 80:80 --name task-manager