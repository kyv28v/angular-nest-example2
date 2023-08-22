SELECT id, room_cd, user_id, entry_dt, exit_dt, note
, EXTRACT(EPOCH FROM exit_dt - entry_dt) / 3600 access_time
, image_file
 FROM room_access_mng
 WHERE (COALESCE($1, '') = '' OR id       >= CAST($1 AS INTEGER))
 AND   (COALESCE($2, '') = '' OR id       <= CAST($2 AS INTEGER))
 AND   (COALESCE($3, '') = '' OR room_cd   = CAST($3 AS CHARACTER VARYING))
 AND   (COALESCE($4, '') = '' OR user_id   = CAST($4 AS INTEGER))
 AND   (COALESCE($5, '') = '' OR entry_dt >= CAST($5 AS TIMESTAMP))
 AND   (COALESCE($6, '') = '' OR entry_dt <= CAST($6 AS TIMESTAMP))
 AND   (COALESCE($7, '') = '' OR exit_dt  >= CAST($7 AS TIMESTAMP))
 AND   (COALESCE($8, '') = '' OR exit_dt  <= CAST($8 AS TIMESTAMP))
 ORDER BY id DESC