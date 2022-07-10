import { getFunctions, httpsCallable } from 'firebase/functions';

export default (functionName, props) => {
  const functions = getFunctions();
  const firebaseFunction = httpsCallable(functions, functionName);
  return firebaseFunction(props);
};
