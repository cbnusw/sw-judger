cd ../../auth
docker build -t sw-judger-auth -f Dockerfile.dev .
cd ../kubernetes/auth
kubectl delete deployment judger-auth
kubectl apply -f .