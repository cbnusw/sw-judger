cd ../../judger-frontend
docker build -t sw-judger-judger-web -f Dockerfile.dev .
cd ../kubernetes/judger-frontend
kubectl delete deployment judger-web
kubectl apply -f .
