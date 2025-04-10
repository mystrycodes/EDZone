export const clerkWebhooks = jest.fn((req, res) => res.status(200).json({ status: 'success' }));
export const stripeWebhooks = jest.fn((req, res) => res.status(200).json({ status: 'success' })); 