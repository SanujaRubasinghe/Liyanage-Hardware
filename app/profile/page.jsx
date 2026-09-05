'use client';
import PrivateRoute from '../../src/Components/PrivateRoutes';
import UserProfile from '../../src/Components/UserProfile';

export default function ProfilePage() {
  return <PrivateRoute element={<UserProfile />} />;
}
