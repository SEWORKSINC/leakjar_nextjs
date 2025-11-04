import { redirect } from 'next/navigation';

export default function LandingLayout() {
  // Redirect landing page to home page to consolidate
  redirect('/');
}

