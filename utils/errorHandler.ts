export const handleApiError = (error: any, headers: any) => {
  console.error('❌ Errore API:', {
    message: error.message,
    details: error.details,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    timestamp: new Date().toISOString()
  });

  return new Response(JSON.stringify({
    error: error.message,
    details: error.details,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  }), { 
    status: 500, 
    headers: { ...headers, 'Content-Type': 'application/json' }
  });
}; 