/*
  # Create Orders View
  
  Creates a view that combines orders and order_items for easier querying
*/

CREATE VIEW order_details AS
SELECT 
  o.id as order_id,
  o.customer_name,
  o.customer_phone,
  o.customer_address,
  o.additional_info,
  o.total_amount,
  o.status,
  o.created_at,
  json_agg(
    json_build_object(
      'product_id', oi.product_id,
      'product_name', p.name,
      'size', oi.size,
      'quantity', oi.quantity,
      'price', oi.price
    )
  ) as items
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.id
GROUP BY o.id, o.customer_name, o.customer_phone, o.customer_address, 
         o.additional_info, o.total_amount, o.status, o.created_at;