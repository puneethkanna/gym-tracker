import DayAnalyticsContent from './DayAnalyticsContent';

export function generateStaticParams() {
  const params: { date: string }[] = [];
  const now = new Date();
  for (let i = 0; i < 365; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    params.push({ date: date.toISOString().split('T')[0] });
  }
  return params;
}

export default function DayAnalyticsPage() {
  return <DayAnalyticsContent />;
}