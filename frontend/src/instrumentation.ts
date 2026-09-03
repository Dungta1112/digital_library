export async function register() {
  if (
    process.env.NEXT_RUNTIME === 'nodejs' &&
    process.env.NEXT_PUBLIC_USE_MOCK_API === 'true'
  ) {
    const { server } = await import('./mocks/server');
    server.listen({ onUnhandledRequest: 'bypass' });
    console.info('[MSW] Server-side Mock API initialized for Server Components 🚀');
  }
}
