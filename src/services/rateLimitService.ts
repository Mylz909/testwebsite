import { supabase } from '../lib/supabase';

const RATE_LIMIT_MINUTES = 30;
const MAX_ORDERS = 3;

export async function checkRateLimit(phone: string): Promise<boolean> {
  const { count } = await supabase
    .from('orders')
    .select('*', { count: 'exact' })
    .eq('customer_phone', phone)
    .gte('created_at', new Date(Date.now() - RATE_LIMIT_MINUTES * 60000).toISOString());

  return (count || 0) < MAX_ORDERS;
}