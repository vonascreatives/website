#!/bin/bash

# Query Michael Brown's record from Sanity
curl -H 'Authorization: Bearer skpuWw73xnJyKN3eYukpkUg0yzZgW3tpuUmW0oguz0Q5n57YOTHvxuUjsmj05ezFx9q5Z5kkzLtqScPMS' \
  -G \
  --data-urlencode 'query=*[_type == "creator" && name match "Michael Brown*"]{_id, name, heroImage, gallery, bio, specialties}' \
  'https://5cywtc7a.api.sanity.io/v2021-10-21/data/query/production'