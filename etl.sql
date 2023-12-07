COPY reviews(id, product_id, rating, review_temp_date, review_date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) FROM './data/reviews.csv' WITH CSV HEADER;

COPY photos(photo_id, review_id, url) FROM './data/reviews_photos.csv' WITH CSV HEADER;

COPY characteristics(characteristic_id, product_id, name) FROM './data/characteristics.csv' WITH CSV HEADER;

COPY char_reviews(id, characteristic_id, review_id, value) FROM './data/characteristic_reviews.csv' WITH CSV HEADER;