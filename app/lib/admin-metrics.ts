import { dbPool } from './db';

export type SourceStat = {
    source_label: string;
    source_host: string | null;
    uniques: number;
};

export type PathStat = {
    landing_path: string;
    uniques: number;
};

export type TrafficSummary = {
    todayUniqueVisitors: number;
    yesterdayUniqueVisitors: number;
    last7DaysUniqueVisitors: number;
    last7DaysDaily: {
        visit_date: string;
        uniques: number;
    }[];
    todayTopSources: SourceStat[];
    last7DaysTopSources: SourceStat[];
    last7DaysTopPages: PathStat[];
};

export async function getTrafficSummary() {
    const timezone = process.env.APP_TIMEZONE ?? 'UTC';

    const [todayCountResult, yesterdayCountResult, last7DaysCountResult, last7DaysDailyResult, todaySourcesResult, last7DaysSourcesResult, last7DaysPagesResult] =
        await Promise.all([
            dbPool.query<{ total: string }>(
                `
                    SELECT COUNT(*)::text AS total
                    FROM traffic_daily_visitors
                    WHERE visit_date = (NOW() AT TIME ZONE COALESCE($1, 'UTC'))::date
                `,
                [timezone]
            ),
            dbPool.query<{ total: string }>(
                `
                    SELECT COUNT(*)::text AS total
                    FROM traffic_daily_visitors
                    WHERE visit_date = ((NOW() AT TIME ZONE COALESCE($1, 'UTC'))::date - INTERVAL '1 day')::date
                `,
                [timezone]
            ),
            dbPool.query<{ total: string }>(
                `
                    SELECT COUNT(*)::text AS total
                    FROM traffic_daily_visitors
                    WHERE visit_date BETWEEN
                        ((NOW() AT TIME ZONE COALESCE($1, 'UTC'))::date - INTERVAL '6 day')::date
                        AND (NOW() AT TIME ZONE COALESCE($1, 'UTC'))::date
                `,
                [timezone]
            ),
            dbPool.query<{ visit_date: string; uniques: number }>(
                `
                    WITH day_series AS (
                        SELECT generate_series(
                            ((NOW() AT TIME ZONE COALESCE($1, 'UTC'))::date - INTERVAL '6 day')::date,
                            (NOW() AT TIME ZONE COALESCE($1, 'UTC'))::date,
                            INTERVAL '1 day'
                        )::date AS visit_date
                    )
                    SELECT
                        day_series.visit_date::text,
                        COALESCE(COUNT(t.id), 0)::int AS uniques
                    FROM day_series
                    LEFT JOIN traffic_daily_visitors t
                        ON t.visit_date = day_series.visit_date
                    GROUP BY day_series.visit_date
                    ORDER BY day_series.visit_date ASC
                `,
                [timezone]
            ),
            dbPool.query<SourceStat>(
                `
                    SELECT source_label, source_host, COUNT(*)::int AS uniques
                    FROM traffic_daily_visitors
                    WHERE visit_date = (NOW() AT TIME ZONE COALESCE($1, 'UTC'))::date
                    GROUP BY source_label, source_host
                    ORDER BY uniques DESC, source_label ASC
                    LIMIT 10
                `,
                [timezone]
            ),
            dbPool.query<SourceStat>(
                `
                    SELECT source_label, source_host, COUNT(*)::int AS uniques
                    FROM traffic_daily_visitors
                    WHERE visit_date BETWEEN
                        ((NOW() AT TIME ZONE COALESCE($1, 'UTC'))::date - INTERVAL '6 day')::date
                        AND (NOW() AT TIME ZONE COALESCE($1, 'UTC'))::date
                    GROUP BY source_label, source_host
                    ORDER BY uniques DESC, source_label ASC
                    LIMIT 10
                `,
                [timezone]
            ),
            dbPool.query<PathStat>(
                `
                    SELECT landing_path, COUNT(*)::int AS uniques
                    FROM traffic_daily_visitors
                    WHERE visit_date BETWEEN
                        ((NOW() AT TIME ZONE COALESCE($1, 'UTC'))::date - INTERVAL '6 day')::date
                        AND (NOW() AT TIME ZONE COALESCE($1, 'UTC'))::date
                    GROUP BY landing_path
                    ORDER BY uniques DESC, landing_path ASC
                    LIMIT 10
                `,
                [timezone]
            ),
        ]);

    return {
        todayUniqueVisitors: Number(todayCountResult.rows[0]?.total ?? 0),
        yesterdayUniqueVisitors: Number(yesterdayCountResult.rows[0]?.total ?? 0),
        last7DaysUniqueVisitors: Number(last7DaysCountResult.rows[0]?.total ?? 0),
        last7DaysDaily: last7DaysDailyResult.rows,
        todayTopSources: todaySourcesResult.rows,
        last7DaysTopSources: last7DaysSourcesResult.rows,
        last7DaysTopPages: last7DaysPagesResult.rows,
    } satisfies TrafficSummary;
}
