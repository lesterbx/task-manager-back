sudo docker stop task-manager
sudo docker rm task-manager
sudo docker system prune 
sudo docker rmi task-manager
sudo docker build -t task-manager .
sudo docker run task-manager -p 80:80 --name
