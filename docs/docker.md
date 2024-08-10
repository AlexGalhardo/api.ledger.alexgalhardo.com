## Docker CLI Commands

Login Dockerhub
```bash
docker login
```

Stop container
```bash
docker stop container_id_or_name
```

Remove container
```bash
docker rm container_id_or_name
```

See container logs
```bash
docker logs container_id_or_name
```

Build the image and give it a name:
```bash
sudo docker build --platform linux/arm64/v8 -t api_nerdapi:latest .
```

Run a container from the newly built image:
```bash
sudo  docker run -d --name api_nerdapi api_nerdapi:latest
```

Fixing error credentials on MacOS
- Change the docker config file.
- The “credsStore” is “desktop” -> change it to “osxkeychain”.
```bash
sudo nano ~/.docker/config.json
```
