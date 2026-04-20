import { useMemo } from 'react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { formatDateToMonthYear } from '../../logic/DateFormetting.js';

export default function BalanceStaircase({ planDates, currentBalance, rawEndDate }) {
    const data = useMemo(() => {
        if (!rawEndDate || currentBalance == null) return [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const end = new Date(rawEndDate);
        end.setHours(0, 0, 0, 0);

        const txByDate = {};
        planDates.forEach(item => {
            if (!item.date) return;
            const d = new Date(item.date);
            d.setHours(0, 0, 0, 0);
            if (d < today) return;
            const key = d.toISOString().split('T')[0];
            txByDate[key] = (txByDate[key] || 0) + (Number(item.amount) || 0);
        });

        const points = [];
        let balance = Number(currentBalance) || 0;
        const cursor = new Date(today);

        while (cursor <= end) {
            const key = cursor.toISOString().split('T')[0];
            if (txByDate[key]) balance -= txByDate[key];
            points.push({
                date: formatDateToMonthYear(cursor.toISOString()),
                balance: Math.round(balance * 100) / 100,
            });
            cursor.setDate(cursor.getDate() + 1);
        }

        return points;
    }, [planDates, currentBalance, rawEndDate]);

    if (data.length === 0) return null;

    const minBalance = Math.min(...data.map(d => d.balance));
    const domain = [Math.min(minBalance * 1.1, 0), 'auto'];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
                <defs>
                    <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0d6efd" stopOpacity={0.05} />
                    </linearGradient>
                </defs>
                <CartesianGrid stroke="#dee2e6" strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis domain={domain} tick={{ fontSize: 11 }} tickFormatter={v => `£${v.toLocaleString()}`} />
                <Tooltip formatter={v => [`£${Number(v).toLocaleString()}`, 'Balance']} />
                <ReferenceLine y={0} stroke="#dc3545" strokeDasharray="4 4" />
                <Area
                    type="stepAfter"
                    dataKey="balance"
                    stroke="#0d6efd"
                    strokeWidth={2}
                    fill="url(#balanceGradient)"
                    dot={false}
                    activeDot={{ r: 4 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
