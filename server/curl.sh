curl -iH "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmb28ifQ.YjDcTye_YH85x1Mwukipa3oJxB2OxMH561HNgqjEVcM" \
    -H "Content-Type: application/json" \
    -X POST \
    localhost:3000/users \
    -d '{"name": "wew"}'
