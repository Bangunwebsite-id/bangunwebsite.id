import { TrafficPanel } from './traffic-panel';
import { getTrafficSummary } from '@/app/lib/admin-metrics';

export default async function AdminTrafficPage() {
    const initialTrafficSummary = await getTrafficSummary();

    return <TrafficPanel initialTrafficSummary={initialTrafficSummary} />;
}
