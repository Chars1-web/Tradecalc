export default async function handler(req, res) {
  const { id, username } = req.query;

  try {
    let playerId = id;

    // ⚠️ username fallback (ONLY works if site supports it)
    if (!playerId && username) {
      playerId = username;
    }

    const response = await fetch(
      `https://www.realkarmaleague.com/snapshots/player?season=S11&league=major&schema=1&id=${playerId}`
    );

    const data = await response.json();

    const perf = data.performance || {};

    // 🔥 FIXED: multiple possible paths
    const rel =
      perf.rel ??
      perf.season?.rel ??
      perf.stats?.rel ??
      null;

    const war =
      perf.war ??
      perf.season?.war ??
      perf.stats?.war ??
      null;

    res.status(200).json({
      id: data.player?.id,
      name: data.player?.handle,
      rel,
      war
    });

  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch player",
      details: err.message
    });
  }
}