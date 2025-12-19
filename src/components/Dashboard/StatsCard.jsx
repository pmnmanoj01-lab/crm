export default function StatsCard({ title, value }) {
return (
<div className="bg-white rounded-lg shadow p-4">
<p className="text-gray-500 text-center text-sm">{title}</p>
<p className="text-2xl text-center text-sm mt-1">{value}</p>
</div>
);
}