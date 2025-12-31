/**
 * HOME PAGE
 * Redirect automático a login
 */

import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/login');
}