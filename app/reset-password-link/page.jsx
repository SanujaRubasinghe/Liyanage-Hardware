import PasswordResetForm from '../../src/Components/PasswordResetForm';
export const metadata = { title: 'Request Password Reset', robots: { index: false, follow: false } };

export default function PasswordResetLinkPage() {
  return <PasswordResetForm />;
}
