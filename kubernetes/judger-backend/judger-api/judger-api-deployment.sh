cd ../../../judger-backend/judger-api
docker build -t sw-judger-judger-api -f Dockerfile.dev .
cd ../../kubernetes/judger-backend/judger-api
kubectl delete deployment judger-api
kubectl apply -f .
