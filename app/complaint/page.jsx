import CustomerComplaintsForm from '../../src/Components/CustomerComplaintsForm';
export const metadata = { title: 'Submit a Complaint', description: 'Submit a customer complaint to New Liyanage Hardware.', alternates: { canonical: '/complaint' } };
export default function ComplaintPage() {
  return <CustomerComplaintsForm />;
}
