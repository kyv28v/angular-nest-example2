SELECT id, room_cd, user_id, entry_dt, exit_dt, note
 FROM room_access_mng
 WHERE (COALESCE($1, '') = '' OR id        = CAST($1 AS INTEGER))
 AND   (COALESCE($2, '') = '' OR room_cd   = CAST($2 AS CHARACTER VARYING))
 AND   (COALESCE($3, '') = '' OR user_id   = CAST($3 AS INTEGER))
 AND   (COALESCE($4, '') = '' OR entry_dt  = CAST($4 AS TIMESTAMP))
 AND   (COALESCE($5, '') = '' OR exit_dt   = CAST($5 AS TIMESTAMP))
 ORDER BY id DESC