export default function Loading() {
  return (
    <main style={{ padding: 24 }}>
      <div
        style={{
          height: 16,
          background: "#f0f0f0",
          borderRadius: 4,
          marginBottom: 12,
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      {/* repeat as needed */}
    </main>
  );
}
