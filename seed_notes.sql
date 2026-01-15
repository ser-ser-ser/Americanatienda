
-- 1. Create Seller User (Wait... we cannot create Auth Users via SQL easily without extensions)
-- Instead, we will assume the user has signed up or we will use a special "Magic" setup page.

/* 
STRATEGY CHANGE:
We cannot create Auth Users via raw SQL easily because of password hashing.
We will create a Client-Side Seeding Page using our existing Auth logic.
*/
