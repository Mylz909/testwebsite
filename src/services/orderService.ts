import { supabase } from '../lib/supabase';
import { sendOrderNotification } from './emailService';
import { checkRateLimit } from './rateLimitService';

export async function createOrder(orderData: OrderData) {
  try {
    // Check rate limit
    const withinLimit = await checkRateLimit(orderData.customerPhone);
    if (!withinLimit) {
      throw new Error('Too many orders. Please try again later.');
    }

    // Format items for database
    const orderItems = orderData.items.map(item => ({
      product_id: item.product.id,
      product_name: item.product.name,
      size: item.selectedSize,
      quantity: item.quantity,
      price: item.product.discountPrice || item.product.price
    }));

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        customer_address: orderData.customerAddress,
        additional_info: orderData.additionalInfo,
        items: orderItems,
        total_amount: orderData.totalAmount,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) throw orderError;
    if (!order) throw new Error('Failed to create order');

    // Send email notification (don't await - we don't want to block the order completion)
    sendOrderNotification({
      orderId: order.id,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerAddress: orderData.customerAddress,
      items: orderItems,
      totalAmount: orderData.totalAmount
    }).catch(console.error); // Log any email errors but don't fail the order

    return order;
  } catch (error) {
    console.error('Order creation failed:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to place order. Please try again.');
  }
}