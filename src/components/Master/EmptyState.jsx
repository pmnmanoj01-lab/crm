const EmptyState = ({message}) => (
  <div className="flex flex-col items-center justify-center py-10 text-gray-500">
    <span className="text-sm"> {message}</span>
    <span className="text-xs">Start by adding a new one</span>
  </div>
);

export default EmptyState
