curl -iH "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmb28ifQ.odyxBktu5inAbzmZ4j0339L-gBLYedYH2bbH1NctccE" \
    -H "Content-Type: application/json" \
    -X POST \
    localhost:3000/users \
    -d '{"name": "wew"}'
