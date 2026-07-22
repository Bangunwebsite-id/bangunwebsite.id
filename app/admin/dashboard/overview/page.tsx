import { OverviewPanel } from './overview-panel';
import { getDashboardOverviewMetrics } from '@/app/lib/admin-metrics';

export default async function AdminOverviewPage() {
    const initialOverviewMetrics = await getDashboardOverviewMetrics();

    return (
        <OverviewPanel
            initialOverviewMetrics={initialOverviewMetrics}
            timezone={process.env.APP_TIMEZONE ?? 'UTC'}
        />
    );
}
