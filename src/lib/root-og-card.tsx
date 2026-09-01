import { getTierImageDataUrl } from "@/lib/og-assets";
import { TIERS } from "@/lib/onion-tiers";

export async function buildRootOgCard() {
  const tier = TIERS[0];
  const onionSrc = await getTierImageDataUrl(tier.key);
  const imageWidth = 320;
  const imageHeight = Math.round(imageWidth * (tier.height / tier.width));

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background:
          "linear-gradient(135deg, #FF8FBB 0%, #FF4F93 55%, #E23C82 100%)",
        padding: "70px 80px",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: "Jua",
      }}
    >
      <div
        style={{ display: "flex", flexDirection: "column", maxWidth: 620 }}
      >
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            background: "rgba(255,255,255,0.22)",
            color: "#fff",
            fontSize: 26,
            padding: "10px 26px",
            borderRadius: 999,
            marginBottom: 32,
          }}
        >
          감정 배출 웹토이
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 66,
            lineHeight: 1.3,
            color: "#fff",
          }}
        >
          <div style={{ display: "flex" }}>오늘 있었던 일,</div>
          <div style={{ display: "flex" }}>양파한테 다 쏟아내세요</div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 28,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          비난양파 · spill-the-onion
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 420,
        }}
      >
        <div
          style={{
            display: "flex",
            background: "#fff",
            color: "#3f2a1f",
            fontSize: 30,
            padding: "16px 28px",
            borderRadius: 28,
            marginBottom: 24,
          }}
        >
          헐 얘기해봐
        </div>
        <img src={onionSrc} alt="" width={imageWidth} height={imageHeight} />
        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 30,
            color: "#fff",
          }}
        >
          비난양파
        </div>
      </div>
    </div>
  );
}
