import emailjs from '@emailjs/browser';

interface OrderEmailParams {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: Array<{
    product_name: string;
    size: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
}

export async function sendOrderNotification(orderDetails: OrderEmailParams): Promise<void> {
  try {
    // Format items list with clear structure and pricing
    const itemsList = orderDetails.items
      .map(item => {
        const subtotal = item.quantity * item.price;
        return `
Product: ${item.product_name}
Size: ${item.size}
Quantity: ${item.quantity}
Price per item: ${item.price} EGP
Subtotal: ${subtotal} EGP
----------------------------------------`;
      })
      .join('\n');

    const templateParams = {
      order_id: orderDetails.orderId,
      customer_name: orderDetails.customerName,
      customer_phone: orderDetails.customerPhone,
      customer_address: orderDetails.customerAddress,
      items_list: itemsList,
      total_amount: `${orderDetails.totalAmount} EGP`
    };

    await emailjs.send(
      'service_0u71a1c',
      'template_tqyvthw',
      templateParams,
      'De97igryC-l7ExGpE'
    );
  } catch (error) {
    console.error('Failed to send email notification:', error);
    // Don't throw the error - we don't want to fail the order if email fails
  }
}