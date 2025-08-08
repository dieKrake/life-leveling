export default function RefreshButton() {
  return (
    <div>
      <button
        className="bg-blue-500 text-white p-2 rounded"
        onClick={() => window.location.reload()}
      >
        Refresh
      </button>
    </div>
  );
}
