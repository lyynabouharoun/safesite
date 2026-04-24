export default function LiveFeed({ frame }) {
  return (
    <div className="live-feed">
      <h3>Live Camera</h3>

      <div className="video-box">
        {frame ? (
          <img src={frame} alt="live" />
        ) : (
          <p>Waiting for stream...</p>
        )}
      </div>
    </div>
  );
}