export async function refundToOriginal(paymentId: string, amount: number) {
    const key = process.env.RAZORPAY_KEY_ID!;
    const secret = process.env.RAZORPAY_KEY_SECRET!;
  
    const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${key}:${secret}`).toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: amount * 100 }),
    });
  
    const data = await response.json();
    return { success: response.ok, data };
  }
  