import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon — larger progress-ring mark. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #243016 0%, #12161c 100%)",
          borderRadius: 40,
          border: "4px solid #2a3140",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 108,
            height: 108,
            borderRadius: 999,
            border: "10px solid #2f3a28",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 108,
            height: 108,
            borderRadius: 999,
            border: "11px solid #b8ff40",
            borderRightColor: "transparent",
            borderBottomColor: "transparent",
            transform: "rotate(-45deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 48,
            left: 42,
            width: 16,
            height: 16,
            borderRadius: 999,
            background: "#b8ff40",
          }}
        />
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 999,
            background: "#b8ff40",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 999,
              background: "#0f1408",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
