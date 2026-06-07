import { Suspense } from 'react';
import EnrollContent from '../register/page';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EnrollContent />
    </Suspense>
  );
}