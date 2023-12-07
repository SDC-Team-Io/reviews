
-- Import reviews
\copy reviews(id, product_id, rating, review_temp_date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) FROM './data/reviews.csv' WITH CSV HEADER;
-- Convert Date
UPDATE reviews SET review_date = to_timestamp(review_temp_date / 1000.0);
-- Remove temp column
ALTER TABLE reviews DROP COLUMN review_temp_date;
-- Update id serial to current value
SELECT setval(pg_get_serial_sequence('reviews', 'id'), (SELECT COALESCE(MAX(id), 0) FROM reviews) + 1);

-- Import photos
\copy photos(photo_id, review_id, url) FROM './data/reviews_photos.csv' WITH CSV HEADER;
-- Update photo_id serial to current value
SELECT setval(pg_get_serial_sequence('photos', 'photo_id'), (SELECT COALESCE(MAX(photo_id), 0) FROM photos) + 1);

-- Import characteristics
\copy characteristics(characteristic_id, product_id, name) FROM './data/characteristics.csv' WITH CSV HEADER;
-- Update characteristic_id serial to current value
SELECT setval(pg_get_serial_sequence('characteristics', 'characteristic_id'), (SELECT COALESCE(MAX(characteristic_id), 0) FROM characteristics) + 1);

-- Import char reviews
\copy char_reviews(id, characteristic_id, review_id, value) FROM './data/characteristic_reviews.csv' WITH CSV HEADER;
-- Update char reviews serial to current value
SELECT setval(pg_get_serial_sequence('char_reviews', 'id'), (SELECT COALESCE(MAX(id), 0) FROM char_reviews) + 1);


