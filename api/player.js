export default async function handler(req, res) {
  const { id, username } = req.query;

  let playerId = id;

  // username → ID lookup fallback (simple scan via snapshots API)
  if (!playerId && username) {
    const search = await fetch(
      `https://www.realkarmaleague.com/snapshots/player?season=S11&league=major&schema=1&id=${username}`
    );

    const data = await search.json().catch(() => null);

    if (data?.player?.id) {
      playerId = data.player.id;
    }
  }

  if (!playerId) {
    return res.status(400).json({ error: "Missing id or username" });
  }

  const response = await fetch(
    `https://www.realkarmaleague.com/snapshots/player?season=S11&league=major&schema=1&id=${playerId}`
  );

  const data = await response.json();
  const p = data.performance || {};

  res.json({
    id: data.player.id,
    name: data.player.handle,
    rel: p.rel ?? null,
    war: p.war ?? null
  });
}