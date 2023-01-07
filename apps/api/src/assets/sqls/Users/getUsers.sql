SELECT id, code, name, age, sex, birthday, note, auth
 FROM users
 WHERE (COALESCE($1, '') = '' OR id       >= CAST($1 AS INTEGER))
 AND   (COALESCE($2, '') = '' OR id       <= CAST($2 AS INTEGER))
 AND   (COALESCE($3, '') = '' OR code LIKE '%' || CAST($3 AS CHARACTER VARYING) || '%')
 AND   (COALESCE($4, '') = '' OR name LIKE '%' || CAST($4 AS CHARACTER VARYING) || '%')
 AND   (COALESCE($5, '') = '' OR age      >= CAST($5 AS INTEGER))
 AND   (COALESCE($6, '') = '' OR age      <= CAST($6 AS INTEGER))
 AND   (COALESCE($7, '') = '' OR sex       = CAST($7 AS INTEGER))
 AND   (COALESCE($8, '') = '' OR birthday >= CAST($8 AS TIMESTAMP))
 AND   (COALESCE($9, '') = '' OR birthday <= CAST($9 AS TIMESTAMP))
 ORDER BY id