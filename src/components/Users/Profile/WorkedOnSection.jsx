
const WorkedOnSection = () => {
     const workedOn = [
    { title: "Get the most out of your team space", subtitle: "Design · Today" },
    { title: "Template - Design Systems", subtitle: "Design · Today" },
    { title: "Template - Design Review", subtitle: "Design · Today" },
  ];

  return (
     <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Worked on</h3>
          <p className="text-sm text-gray-400">Recently created documents.</p>
        </div>
      </div>

      <ul className="space-y-3">
        {workedOn.map((w, i) => (
          <li key={i} className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center border">
              <div className="text-blue-600 text-sm font-semibold">DOC</div>
            </div>
            <div>
              <div className="font-medium">{w.title}</div>
              <div className="text-xs text-gray-400">{w.subtitle}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default WorkedOnSection