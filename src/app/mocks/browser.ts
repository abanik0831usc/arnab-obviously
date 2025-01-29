if (typeof window !== 'undefined') {
  import('msw/browser')
    .then(({ setupWorker }) => {
      import('./handlers')
        .then(({ handlers }) => {
          const worker = setupWorker(...handlers);
          worker
            .start({ onUnhandledRequest: 'bypass' })
            .then(() => console.log('MSW Worker started successfully'))
            .catch((error) =>
              console.error('Error starting MSW worker:', error)
            );
        })
        .catch((error) =>
          console.error('Error importing handlers for MSW:', error)
        );
    })
    .catch((error) =>
      console.error('Error importing msw/browser for MSW:', error)
    );
}
