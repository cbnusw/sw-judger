cd ../../../judger-backend/judger
docker build -t sw-judger-judger -f Dockerfile.dev .
cd ../../kubernetes/judger-backend/judger
kubectl delete deployment judger
kubectl apply -f .
