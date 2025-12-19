import { Link } from "react-router-dom";

export default function QuickActions() {
  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

      <div className="flex flex-wrap gap-4">
        <Link
          to="/dashboard/team"
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          Manage Team
        </Link>

        <Link
          to="/dashboard/products"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
        >
          View Products
        </Link>

        <Link
          to="/dashboard/products/create"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
        >
          Add Product
        </Link>
      </div>
    </div>
  );
}
