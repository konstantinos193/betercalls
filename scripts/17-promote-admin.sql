-- Promote the specific user to admin
SELECT promote_to_admin('jkcoc45@gmail.com');

-- Verify the promotion worked
SELECT 
  u.email,
  p.is_admin,
  p.subscription_status
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE u.email = 'jkcoc45@gmail.com'; 