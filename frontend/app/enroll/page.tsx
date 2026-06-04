import { Suspense } from 'react';
import EnrollContent from './registerContent';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EnrollContent />
    </Suspense>
  );
}