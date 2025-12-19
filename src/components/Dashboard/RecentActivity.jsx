export default function RecentActivity() {
  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>

      <ul className="space-y-3 text-sm text-gray-600">
        <li>✔ Admin created a new product</li>
        <li>✔ Manager updated permissions</li>
        <li>✔ Employee completed a task</li>
        <li>✔ Admin opened Manager panel</li>
      </ul>
    </div>
  );
}
