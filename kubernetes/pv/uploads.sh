kubectl delete pvc uploads-pvc
kubectl delete pv uploads-pv

kubectl apply -f ./uploads-pv.yaml
kubectl apply -f ./uploads-pvc.yaml