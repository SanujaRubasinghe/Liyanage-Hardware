import PrivateRoute from '../../src/Components/PrivateRoutes';
import UserProfile from '../../src/Components/UserProfile';
export const metadata = { title: 'Your Profile', robots: { index: false, follow: false } };

export default function ProfilePage() {
  return <PrivateRoute element={<UserProfile />} />;
}
