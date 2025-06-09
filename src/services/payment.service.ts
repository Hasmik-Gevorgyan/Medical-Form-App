export async function createPaymentIntent(amount: number): Promise<string> {
    const response = await fetch(
      "https://us-central1-medical-project-2ba5d.cloudfunctions.net/createPaymentIntent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      }
    );
  
    if (!response.ok) {
      throw new Error("Failed to create payment intent");
    }
  
    const data: { clientSecret: string } = await response.json();
    return data.clientSecret;
}
