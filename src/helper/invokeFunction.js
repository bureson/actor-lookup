export default async function invokeFunction(functionName, props = {}) {
  const response = await fetch(`/api/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(props)
  });

  if (!response.ok) {
    let message = `API error (${response.status})`;
    try {
      const err = await response.json();
      message = err.error || message;
    } catch (e) {
      console.error(e);
    }
    throw new Error(message);
  }

  return {
    data: await response.json()
  };
}